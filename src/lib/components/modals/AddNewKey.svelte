<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { rpc } from "$lib/stores/ndk";
	import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';
	import { modalStore } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();

    let keyName = '';
    let passphrase = '', passphraseConfirm = '';
    let nsec = '';
    let creating = false;
    let creationResult: undefined | { npub: string; };

    async function createNewKeyResponseHandler(response: NDKRpcResponse) {
        const res = JSON.parse(response.result);

        creationResult = res;
        dispatch('reloadKeys');
    }

    async function createNewKey() {
        creating = true;

        const params = [ keyName, passphrase ];

        if (nsec.length > 0) { params.push(nsec); }

        $rpc?.sendRequest($remoteBunkerPubkey!, 'create_new_key', params, 24134, createNewKeyResponseHandler);
    }

    function close() {
        modalStore.close();
    }

    let nsecFocus = false;
</script>

<div class="
    variant-filled-surface
    rounded-lg
    p-8
    flex flex-col gap-8
    max-w-prose
">
    {#if creationResult}
        New key generated:

        <div class="text-lg font-bold text-white font-mono overflow-auto">
            {creationResult.npub}
        </div>
    {:else if creating}
        Creating new key
    {:else}
        <aside class="alert variant-ghost-secondary">
            <div class="alert-message">
                <h3 class="h3 font-bold">Add New Key</h3>
                <p>
                    Create a new key to be managed from your Bunker.
                </p>
            </div>
        </aside>

        <label class="label">
            <span class="font-semibold text-lg">Key name</span>
            <input class="input" type="text" placeholder="Key name" bind:value={keyName} />
            <div class="text-white text-sm">
                This name helps you identify the key. It's not used, or published, anywhere else.
            </div>
        </label>

        <label class="label">
            <span class="font-semibold text-lg">
                Nsec
                <span class="font-extralight">(optional)</span>
            </span>
            <input class="input font-mono" type="password" placeholder="nsec1..." bind:value={nsec} on:focus={() => nsecFocus = true} on:blur={() => nsecFocus = false} />
            <div class="text-white text-sm">
                If you already have an existing nsec you can paste it here to import it.
            </div>
        </label>

        {#if nsecFocus}
            <aside class="alert variant-ghost-secondary" transition:fade>
                <div class="alert-message">
                    <h3 class="h3 font-bold">Key Treatment</h3>
                    <div class="flex flex-col gap-3">
                        <span>Your nsec is transmitted to your Bunker encrypted.</span>
                        <span>Only the Bunker's key, which has never been transmitted over the internet, can decrypt it.</span>
                        <span>Once in the Bunker, the nsec is encrypted with the passphrase you provide below.</span>
                    </div>
                </div>
            </aside>
        {/if}

        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-end">
                <label class="label w-1/2">
                    <span class="font-semibold text-lg">Passphrase</span>
                    <input class="input" type="password" placeholder="Passphrase" bind:value={passphrase} />
                </label>

                <label class="label w-1/2">
                    <input class="input" type="password" placeholder="Confirm passphrase" bind:value={passphraseConfirm} />

                </label>
            </div>

            <div class="text-white text-sm flex flex-col gap-2">
                <div class="text-sm">Keys are encrypted in your Bunker with this passphrase.</div>
                <div class="text-sm">You will need to enter this passphrase to load
                    the key every time you restart your Bunker.</div>
            </div>
        </div>

        <div class="flex flex-row items-center gap-4 justify-stretch">
            <button
                type="button"
                class="btn btn-lg variant-filled-secondary w-1/2"
                on:click={createNewKey}
                disabled={(passphrase !== passphraseConfirm || passphrase.length === 0) || keyName.length === 0}
            >
                {#if nsec.length > 0}
                    Import NSec
                {:else}
                    Create New Key
                {/if}
            </button>
            <button type="button" class="btn btn-lg variant-filled w-1/2" on:click={close}>Cancel</button>
        </div>
    {/if}
</div>