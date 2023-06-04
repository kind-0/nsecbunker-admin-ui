<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar, Toast, Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { ndk, rpc } from '$lib/stores/ndk';
	import { currentUser } from '$lib/stores/user';
	import NDK, { NDKNip07Signer, NDKNostrRpc, NDKUser, type NDKRpcRequest } from '@nostr-dev-kit/ndk';
	import debug from 'debug';
	import { bunkerRelays, remoteBunkerNpub, remoteBunkerPubkey } from "$lib/stores/user";
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { requestIds, requestMap } from '$lib/stores/requests';
	import AddNewKey from '$lib/components/modals/AddNewKey.svelte';

	let rpcPromise: Promise<any> | undefined = undefined;

	onMount(() => {
	})

	$: if (!$remoteBunkerNpub) {
		// if not on login page
		if (browser && window.location.pathname !== '/login')
			goto('/login');
	}

	// Set the remoteBunkerPubkey if we have the remoteBunkerNpub
	$: if (!$remoteBunkerPubkey && $remoteBunkerNpub) {
        const user = new NDKUser({npub: $remoteBunkerNpub});
        $remoteBunkerPubkey = user.hexpubkey();
    }

	// initialize the NDK and connect
	$: if ($remoteBunkerNpub && !$ndk) {
		$ndk = new NDK({
			explicitRelayUrls: $bunkerRelays,
			signer: new NDKNip07Signer(),
		});
		$ndk.connect(5000);
	}

	// $ndk.signer might be undefined when the app first loads since its provided by a browser extension
	// attempt to load it every 100ms until it is available
	const checkInterval = setInterval(() => {
		// Once the signer is available, we can create the rpc client
		if ($ndk?.signer) {
			$ndk.signer.user().then((u) => {
				$currentUser = u;

				$rpc = new NDKNostrRpc($ndk!, $ndk!.signer!, debug('nsecBunker:rpc'));

				// Listen for incoming requests and add them to the requestIds and requestMap stores
				$rpc!.on('request', (req: NDKRpcRequest) => {
					$requestIds.push(req.id);
					$requestMap[req.id] = req;

					$requestIds = [...$requestIds];

					// After 30 seconds, remove the request from the requestIds and requestMap stores
					setTimeout(() => {
						$requestIds = $requestIds.filter((id) => id !== req.id);
						delete $requestMap[req.id];
						$requestIds = [...$requestIds];
					}, 300000);
				});

				rpcPromise = $rpc!.subscribe({
					kinds: [24134 as number], // 24134
					authors: [$remoteBunkerPubkey!],
					'#p': [$currentUser.hexpubkey()],
				});

				clearInterval(checkInterval);
			})
		}
	}, 100);

	const modalComponentRegistry: Record<string, ModalComponent> = {
		addNewKey: { ref: AddNewKey },
	};

	function logout() {
		$remoteBunkerNpub = null;
		$remoteBunkerPubkey = null;
		$ndk = undefined;
		$rpc = null;
		$bunkerRelays = [];
	}

</script>

<svelte:head>
	<title>nsecBunker admin UI</title>
</svelte:head>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-xl">nsecBunker UI</strong></a>

				{#if $remoteBunkerNpub && $currentUser}
					<div class="ml-8 flex flex-row gap-6 flex-1">
						<a
							class="btn btn-sm variant-ghost-surface"
							href="/keys"
						>
							Keys
						</a>
						<a
							class="btn btn-sm variant-ghost-surface"
							href="/events"
						>
							Events
						</a>

						<a
							class="btn btn-sm variant-ghost-surface"
							href="/policies"
						>
							Policies
						</a>
					</div>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="trail">
				{#if $remoteBunkerNpub}
					<button class="
						btn variant-ghost-surface
					" on:click={logout}>Logout</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
	</svelte:fragment>

	<!-- Page Route Content -->
	{#if !$remoteBunkerNpub}
		<slot />
	{:else if currentUser}
		{#await rpcPromise}
		{:then}
			<slot />
		{/await}
	{/if}

	<svelte:fragment slot="pageFooter">
		<div class="flex flex-col items-center w-full">
			<div class="flex flex-row gap-4 text-xs text-center p-4 text-zinc-400">
				&copy; Copyright {new Date().getFullYear()} by Sanity Island Inc.
			</div>
		</div>
	</svelte:fragment>

</AppShell>

<Toast />
<Modal components={modalComponentRegistry} />
