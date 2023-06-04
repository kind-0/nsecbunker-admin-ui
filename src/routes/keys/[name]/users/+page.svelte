<script lang="ts">
	import { remoteBunkerPubkey } from '$lib/stores/user';
	import { page } from "$app/stores";
	import { loadKeyUsers, type KeyUser } from "$lib/nostr/keys/users";
	import { onMount } from "svelte";
    import User from "./user.svelte";

    const { name } = $page.params;

    let loadKeyUsersPromise: Promise<KeyUser[]>;

    onMount(() => {
        loadKeyUsersPromise = loadKeyUsers($remoteBunkerPubkey!, name);
    });
</script>

<div class="mx-auto max-w-prose my-4">
    <div class="text-4xl mb-4">
        Key: {name}
    </div>

    {#await loadKeyUsersPromise}
    {:then users}
        {#if users}
            <div class="flex flex-col gap-8">
                {#each users as user}
                    <User {user} />
                {/each}
            </div>
        {/if}
    {/await}
</div>