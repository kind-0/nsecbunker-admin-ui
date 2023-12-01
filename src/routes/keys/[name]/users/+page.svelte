<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { page } from "$app/stores";
	import { loadKeyUsers, type KeyUser } from "$lib/nostr/keys/users";
	import { onMount } from "svelte";
    import User from "./user.svelte";

    const { name } = $page.params;

    let loadKeyUsersPromise: Promise<KeyUser[]>;
    let includeRevoked = false;

    onMount(() => {
        loadKeyUsersPromise = loadKeyUsers($remoteBunkerPubkey!, name);
    });

    function sorted(users: KeyUser[]) {
        // sort users by whether revokedAt is null (null go first), then sort by
        // lastUsedAt (most recent first)
        return users.sort((a: KeyUser, b: KeyUser) => {
            console.log(a.revokedAt, b.revokedAt);
            if (!a.revokedAt && b.revokedAt) {
                return -1;
            } else if (a.revokedAt && !b.revokedAt) {
                return 1;
            } else {
                return parseInt(b.lastUsedAt) - parseInt(a.lastUsedAt);
            }
        });
    }
</script>

<div class="mx-auto max-w-prose my-4">
    <div class="flex flex-row justify-between mb-4">
        <div class="text-4xl mb-4">
            Key: {name}
        </div>

        <label class="label flex flex-row items-center gap-2">
            <input type="checkbox" bind:checked={includeRevoked} class="checkbox" />
            Include revoked keys
        </label>
    </div>

    {#await loadKeyUsersPromise}
        Loading users
    {:then users}
        {#if users}
            <div class="flex flex-col gap-8">
                {#each sorted(users) as user}
                    {#if includeRevoked || !user.revokedAt}
                        <User {user} />
                    {/if}
                {/each}
            </div>
        {/if}
    {:catch error}
            Error: {error}
    {/await}
</div>