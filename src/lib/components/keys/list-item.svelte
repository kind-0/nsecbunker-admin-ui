<script lang="ts">
	import { rpc } from "$lib/stores/ndk";
	import { remoteBunkerPubkey } from "$lib/stores/user";
    import { type ModalSettings, modalStore } from "@skeletonlabs/skeleton";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let key: {
        name: string;
        npub?: string;
    };

    function unlockKey(keyName: string) {
        new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'prompt',
                // Data
                title: 'Unlock Key',
                body: 'Enter key passphrase to unlock it',
                // Populates the input value and attributes
                value: '',
                valueAttr: { type: 'password', minlength: 1, maxlength: 100, required: true },
                // Returns the updated response value
                response: resolve,
            };
            modalStore.trigger(modal);
        }).then((password: any) => {
            $rpc!.sendRequest(
                $remoteBunkerPubkey!,
                'unlock_key',
                [keyName, password],
                24134,
                (response) => {
                    dispatch('reloadKeys');
                },
            );
        });
    }
</script>

<div class="flex flex-row items-center gap-4">
    <div class="truncate flex-1">
        <div class="text-lg text-white font-bold">
            {key.name}
        </div>
        <div class="text-sm text-zinc-500">
            {#if key.npub}
                {key.npub}
            {:else}
                Locked key
            {/if}
        </div>
    </div>

    <div class="flex flex-row items-center gap-4">
        {#if key.npub}
            <a href="/keys/{key.name}/users" type="button" class="btn text-sm variant-filled-surface">Users</a>
            <a href="/keys/{key.name}/tokens" type="button" class="btn text-sm variant-filled-surface">Tokens</a>
        {:else}
            <button class="
                btn variant-filled-surface
                text-white
                font-semibold
            " on:click={() => unlockKey(key.name)}>
                Unlock
            </button>
        {/if}
    </div>
</div>