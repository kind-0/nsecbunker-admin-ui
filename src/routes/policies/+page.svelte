<script lang="ts">
    import { remoteBunkerPubkey } from "$lib/stores/user";
    import { loadPolicies } from '$lib/nostr/policies/load.js'
	import type { NDKSubscription } from "@nostr-dev-kit/ndk";
	import { onDestroy, onMount } from "svelte";
	import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import PolicyListItem from "$lib/components/policies/PolicyListItem.svelte";

    let requestSub: NDKSubscription;
    let loadPoliciesPromise: Promise<any>;

    onMount(async () => {
        loadPoliciesPromise = loadPolicies($remoteBunkerPubkey!);
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
            reloadPolicies();
        });

    }

    function reloadPolicies() {
        loadPoliciesPromise = loadPolicies($remoteBunkerPubkey!);
    }
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    {#if loadPoliciesPromise}
        <div class="flex flex-row items-center justify-between">
            <div class="text-2xl font-bold text-white">Policies</div>

            <a href="/policies/new" type="button" class="btn variant-filled-primary">New Policy</a>
        </div>

        {#await loadPoliciesPromise}
            Loading
        {:then policies}
            {#if policies.length === 0}
                No policies created yet.
            {/if}

            {#each policies as policy}
                <PolicyListItem {policy} on:reloadPolicies={reloadPolicies} />
            {/each}
        {/await}
    {/if}
</div>