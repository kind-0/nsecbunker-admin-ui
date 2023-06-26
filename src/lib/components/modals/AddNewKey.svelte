<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { rpc } from "$lib/stores/ndk";
	import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';
	import { Step, modalStore } from '@skeletonlabs/skeleton';
    import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
    import {Stepper} from '@skeletonlabs/skeleton';

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
        <aside class="alert variant-outline-primary">
            <div class="alert-message">
                <h3 class="h3 font-bold">Add New Key</h3>
                <p>
                    Create a new key to be managed from your Bunker.
                </p>
            </div>
        </aside>

        <Stepper
            on:complete={createNewKey}
        >
            <Step locked={keyName.length === 0}>
                <svelte:fragment slot="header">Key name</svelte:fragment>
                <input class="input" type="text" placeholder="Key name" bind:value={keyName} />
                <div class="text-white text-sm">
                    This name helps you identify the key. It's not used, or published, anywhere else.
                </div>
            </Step>

            <Step buttonNextLabel="Passphrase →">
                <svelte:fragment slot="header">NSec <span class="font-extralight">(optional)</span></svelte:fragment>
                <input class="input font-mono" type="password" placeholder="nsec1..." bind:value={nsec} on:focus={() => nsecFocus = true} on:blur={() => nsecFocus = false} />
                <div class="text-white text-sm">
                    Import your nsec here or leave it blank to create a new nostr keypair/identity.
                </div>

                <aside class="alert variant-ghost-secondary">
                    <div class="alert-message">
                        <div class="flex flex-col gap-3">
                            <span>Your nsec is transmitted to your Bunker encrypted.</span>
                            <span>Only the Bunker's key, which has never been transmitted over the internet, can decrypt it.</span>
                            <span>Once in the Bunker, the nsec is encrypted with the passphrase you provide next.</span>
                        </div>
                    </div>
                </aside>
            </Step>

            <Step
                locked={(passphrase !== passphraseConfirm || passphrase.length === 0)}

            >
                <div class="flex flex-row gap-2 items-end">
                    <label class="label w-1/2">
                        <span class="font-semibold text-lg">Passphrase</span>
                        <input class="input" type="password" placeholder="Passphrase" bind:value={passphrase} />
                    </label>

                    <label class="label w-1/2">
                        <input class="input" type="password" placeholder="Confirm passphrase" bind:value={passphraseConfirm} />

                    </label>
                </div>

                <aside class="alert variant-ghost-secondary">
                    <div class="alert-message">
                        <div class="flex flex-col gap-3">
                            <p>Keys are encrypted in your Bunker with this passphrase.</p>
                            <p>You will need to enter this passphrase to load
                                the key if the Bunker is restarted.</p>
                        </div>
                    </div>
                </aside>
            </Step>
        </Stepper>
    {/if}
</div>