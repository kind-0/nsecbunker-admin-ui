<script lang="ts">
    import { remoteBunkerPubkey } from "$lib/stores/user";
    import { ndk, rpc } from "$lib/stores/ndk";
    import { loadKeys } from '$lib/nostr/keys/load.js'
	import type { NDKSubscription } from "@nostr-dev-kit/ndk";
	import { onDestroy, onMount } from "svelte";
	import { requestIds, requestMap } from "$lib/stores/requests";
    import AclRequest from "./AclRequest.svelte";
	import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import KeyListItem from "$lib/components/keys/list-item.svelte";

    let requestSub: NDKSubscription;
    let loadKeysPromise: Promise<any>;

    onMount(async () => {
        loadKeysPromise = loadKeys($remoteBunkerPubkey!);
    })

    onDestroy(() => {
        requestSub?.stop()
    })

    function showAddKeyModal() {
        new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'component',
                // Pass the component registry key as a string:
                component: 'addNewKey',
                response: resolve,
            };
            modalStore.trigger(modal);
        }).then(() => {
            reloadKeys();
        });

    }

    function reloadKeys() {
        loadKeysPromise = loadKeys($remoteBunkerPubkey!);
    }
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    {#if loadKeysPromise}
        <div class="flex flex-row items-center justify-between">
            <div class="text-2xl font-bold text-white">Keys</div>

            <button type="button" class="btn variant-filled" on:click={showAddKeyModal}>Add Key</button>
        </div>

        {#await loadKeysPromise}
            Loading
        {:then keys}
            {#if keys.length === 0}
                No keys created yet.
            {/if}

            {#each keys as key}
                <KeyListItem {key} on:reloadKeys={reloadKeys} />
            {/each}
        {/await}
    {/if}

    {#each $requestIds as requestId}
        {#if $requestMap[requestId].method === 'acl'}
            <AclRequest request={$requestMap[requestId]} />
        {:else}
            <p>{JSON.stringify($requestMap[requestId])}</p>
        {/if}
    {/each}
</div>