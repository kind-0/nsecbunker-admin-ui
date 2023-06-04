<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { page } from "$app/stores";
	import { loadKeyTokens } from "$lib/nostr/keys/tokens.js";
	import { onMount } from "svelte";
    import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import { goto } from '$app/navigation';

    const { name } = $page.params;

    let loadTokensPromise: Promise<App.Token[]>;
    let includeExpired = false;

    onMount(() => {
        loadTokensPromise = loadKeyTokens($remoteBunkerPubkey!, name);
    });
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between mb-4">
        <div class="text-2xl font-bold text-white">{name}'s tokens</div>

        <a href="/keys/{name}/tokens/new" class="btn variant-filled">Add Token</a>
    </div>

    <div class="alert variant-ghost-secondary">
        Tokens allow you to issue permissions to users, which they apply to an npub of their choosing
        without requiring interactivity.
    </div>

    <label class="label flex flex-row items-center gap-2">
        <input type="checkbox" bind:checked={includeExpired} class="checkbox" />
        Include expired tokens
    </label>


    {#await loadTokensPromise}
    {:then tokens}
        {#if tokens && tokens.length > 0}
            <div class="flex flex-col gap-4">
                {#each tokens as token}
                    {#if includeExpired || (token.time_until_expiration >= 0 || token.redeemed_at !== null) }
                        <div class="card p-4 flex flex-col gap-4">
                            <div class="flex flex-row items-center justify-between">
                                <div class="text-lg font-bold text-white">{token.client_name}</div>
                                <div class="text-sm text-zinc-400">{token.policy_name}</div>
                            </div>
                            <div class="flex flex-row items-center justify-between">
                                <div class="text-sm text-zinc-400">
                                    {#if token.redeemed_at}
                                        redeemed
                                        {token.redeemed_by ? ' by ' + token.redeemed_by : ''}
                                    {:else if token.time_until_expiration === 0}
                                        expires now
                                    {/if}
                                    {#if token.time_until_expiration < 0}
                                        expired
                                    {:else if token.time_until_expiration}
                                        expires in {parseInt(token.time_until_expiration/60)} minutes
                                    {/if}
                                </div>
                            </div>

                            {#if !token.redeemed_at && (!token.time_until_expiration || token.time_until_expiration >= 0)}
                                <textarea class="font-mono input h-32">{token.token}</textarea>
                                <button class="btn variant-ghost-secondary self-start"
                                on:click={() => { navigator.clipboard.writeText(token.token)}}
                                >Copy to clipboard</button>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        {:else}
            <div class="alert variant-filled-surface">
                No tokens created yet or key locked.
            </div>
        {/if}
    {/await}
</div>
