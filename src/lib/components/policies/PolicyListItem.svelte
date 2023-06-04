<script lang="ts">
    import RuleListItem from '$lib/components/policies/RuleListItem.svelte';
    export let policy: App.Policy;
</script>

<div class="flex flex-col gap-4">
    <div class="text-xl font-bold">{policy.name}</div>
    {#if policy.description}
        <div class="text-sm text-gray-500">{policy.description}</div>
    {/if}

    <div class="text-base font-semibold">
        Rules
    </div>

    <ul>
        {#each policy.rules as rule}
            <RuleListItem {rule} />
        {/each}
    </ul>
</div>