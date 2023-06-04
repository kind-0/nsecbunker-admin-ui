<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { rpc } from "$lib/stores/ndk";
	import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
    import { createEventDispatcher, onMount } from 'svelte';
	import { loadPolicies } from '$lib/nostr/policies/load';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

    const { name } = $page.params;

    let clientName = '';
    let duration: number | undefined;
    let creating = false;
    let policy: string;

    let loadPoliciesPromise: Promise<any>;

    onMount(async () => {
        loadPoliciesPromise = loadPolicies($remoteBunkerPubkey!);
    })

    async function createNewTokenResponseHandler(response: NDKRpcResponse) {
        const res = JSON.parse(response.result);
        goto(`/keys/${name}/tokens`);
    }

    async function createNewToken() {
        creating = true;

        setTimeout(() => {
            creating = false;
        }, 10000);

        const params: string[] = [ name, clientName, policy, duration?.toString() ];

        console.log({params})

        $rpc?.sendRequest($remoteBunkerPubkey!, 'create_new_token', params, 24134, createNewTokenResponseHandler);
    }
</script>

<div class="
    my-4
    mx-auto
    flex flex-col gap-8
    max-w-prose
">
    {#if loadPoliciesPromise}
        <h3 class="h3 font-bold">New Token</h3>

        <label class="label">
            <span class="font-semibold text-lg text-white">Client name</span>
            <input class="input" type="text" placeholder="Client name" bind:value={clientName} />
            <div class="text-white text-sm">
                Provide a name for this user/client that you will recognize later.
            </div>
        </label>

        <div class="flex flex-col gap-2">
            <div class="font-semibold text-lg text-white">Policy</div>
            <div class="text-sm text-zinc-400">
                Choose the policy that should be applied to the user who redeems this token.
            </div>
            {#await loadPoliciesPromise}
            {:then policies}
                {#if policies.length === 0}
                    No policies created yet.
                {:else}
                    <RadioGroup rounded="rounded-container-token" display="flex-col">
                        {#each policies as _policy}
                            <RadioItem bind:group={policy} name="justify" value={_policy.id}>{_policy.name}</RadioItem>
                        {/each}
                    </RadioGroup>
                {/if}
            {/await}
        </div>

        <label class="label">
            <span class="font-semibold text-lg text-white">Expire in</span>
            <div class="flex flex-row items-center gap-4">
                <input class="input w-48" type="number" placeholder="" bind:value={duration} />
                <span>hours</span>
            </div>
            <div class="text-white text-sm">
                Provide an optional number of hours after which the token cannot be redeemed anymore.
            </div>
        </label>

        <div class="flex flex-row items-center gap-4 justify-stretch">
            <button
                type="button"
                class="btn btn-lg variant-filled-primary w-1/2"
                on:click={createNewToken}
                disabled={(!clientName || !policy || creating)}
            >
                Create Token
            </button>
            <a href="/keys/{name}/tokens" class="btn btn-lg variant-filled w-1/2">Cancel</a>
        </div>
    {/if}
</div>