<script lang="ts">
    import { formatRuleMethod, kindToRule } from '$lib/components/policy-editor/utils';
    export let rule: App.PolicyRule;
</script>

<li class="text-base gap-2 text-zinc-400">
    <span class="font-semibold">Permission:</span>
    <span class="text-white">{formatRuleMethod(rule.method)}</span>
    {#if rule.kind !== undefined && rule.kind !== null}
        of
        {#if rule.kind !== 'all'}
            kind
            <span class="text-white">{kindToRule(rule.kind)}</span>
        {:else}
            <span class="text-white">any kind</span>
        {/if}
    {/if}
    {#if rule.useCount !== undefined}
        <span class="text-xs text-white">({rule.useCount} uses)</span>
    {/if}
</li>