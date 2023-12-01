<script lang="ts">
    import { remoteBunkerPubkey } from "$lib/stores/user";
    import { loadKeys, type Key } from '$lib/nostr/keys/load.js'
	import type { NDKSubscription } from "@nostr-dev-kit/ndk";
	import { onDestroy, onMount } from "svelte";
	import { requestIds, requestMap } from "$lib/stores/requests";
    import AclRequest from "./AclRequest.svelte";
	import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import KeyListItem from "$lib/components/keys/list-item.svelte";
    import WithRetry from "$lib/components/WithRetry.svelte";
	import EmptyKeyList from "$lib/components/EmptyKeyList.svelte";
	import EmptyUserList from "$lib/components/EmptyUserList.svelte";

    let requestSub: NDKSubscription;

    let promiseCreator: any;

    onMount(() => {
        setTimeout(() => {
            console.log('setting promise creator');
            promiseCreator = () => loadKeys($remoteBunkerPubkey!);
        }, 1000);
    });

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
        reloader++;
    }

    let reloader = 0;
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between">
        <div class="text-2xl font-bold text-white">Keys</div>

        <button type="button" class="btn variant-filled-primary" on:click={showAddKeyModal}>Add Key</button>
    </div>

    {#if promiseCreator}
        {#key reloader}
            <WithRetry
                {promiseCreator}
                let:value={keys}
            >
                {#if keys.length === 0}
                    <EmptyKeyList />
                {/if}

                {#each keys as key}
                    <KeyListItem {key} on:reloadKeys={reloadKeys} />
                {/each}

                {#if keys.length === 1 && !keys.some(k => k.userCount > 0)}
                    <EmptyUserList keyName={keys[0].name} />
                {/if}
            </WithRetry>
        {/key}
    {/if}

    {#each $requestIds as requestId}
        {#if $requestMap[requestId].method === 'acl'}
            <AclRequest request={$requestMap[requestId]} />
        {:else}
            <p>{JSON.stringify($requestMap[requestId])}</p>
        {/if}
    {/each}
</div>