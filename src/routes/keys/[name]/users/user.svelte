<script lang="ts">
	import type { KeyUser } from "$lib/nostr/keys/users";
	import { rpc } from "$lib/stores/ndk";
	import { remoteBunkerPubkey } from "$lib/stores/user";
	import { NDKUser, type NDKRpcResponse } from "@nostr-dev-kit/ndk";

    export let user: KeyUser;

    const u = new NDKUser({hexpubkey: user.pubkey});
    const npub = u.npub;

    const niceDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString();
    }

    let displayInput = false;

    function showInput() {
        displayInput = true;
    }

    function onKeypress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            displayInput = false;
            user.description = newDescription;
            user = {...user};

            $rpc!.sendRequest(
                $remoteBunkerPubkey!,
                'rename_key_user',
                [user.pubkey, newDescription],
                24134,
                (response: NDKRpcResponse) => { window.location.reload();}
            );
        } else if (event.key === "Escape") {
            displayInput = false;
        }
    }

    let newDescription = user.description;

    function afterRevoke({result, error}) {
        const res = JSON.parse(result);

        if (res[0] === 'ok') {
            window.location.reload();
        } else {
            let err = error ? JSON.stringify(error) : result;

            alert(`Error revoking key: ${err}`);
        }
    }


    function revoke(user) {
        if (true || confirm('Are you sure you want to revoke this key?')) {
            const params: string[] = [ user.id.toString() ];

            $rpc?.sendRequest($remoteBunkerPubkey!, 'revoke_user', params, 24134, afterRevoke);
        }
    }
</script>

<div class="flex flex-col items-center gap-2">
    <div class="flex flex-row w-full">
        <div class="w-8 truncate flex-1">
            {#if displayInput}
                <input type="text" class="w-full text-lg rounded-lg bg-transparent" bind:value={newDescription} on:keypress={onKeypress} />
            {:else}
                <a class="text-xl" on:click|preventDefault={showInput}>
                    {user.description || "Untitled Key"}
                </a>
            {/if}
            <div class="text-sm">
                {npub}
            </div>
        </div>

        <div class="w-fit flex flex-col gap-4">
            <div class="text-sm">
                <div class="text-lg">Authorized At</div>
                {niceDate(user.createdAt)}
            </div>

            {#if user.lastUsedAt}
                <div class="text-sm">
                    <div class="text-lg">Last Used At</div>
                    {niceDate(user.lastUsedAt)}
                </div>
            {/if}

            {#if user.revokedAt}
                <div class="text-sm">
                    <div class="text-lg">Revoked At</div>
                    {niceDate(user.revokedAt)}
                </div>
            {:else}
                <button on:click={() => revoke(user)} class="btn variant-filled-warning btn-sm">Revoke</button>
            {/if}
        </div>
    </div>

    {#if user.signingConditions}
        <div class="text-lg w-full">Permissions</div>

        {#each user.signingConditions as signingCondition}
            <div class="flex flex-row items-center gap-4 w-full">
                <div class="w-full truncate flex-1">
                    <div class="text-sm">
                        {#if signingCondition.method === 'sign_event' && signingCondition.kind}
                            <b>Sign events of kind:</b>
                            {signingCondition.kind}
                        {:else}
                            <b>{signingCondition.method}:</b>
                            {!!signingCondition.allowed}
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>