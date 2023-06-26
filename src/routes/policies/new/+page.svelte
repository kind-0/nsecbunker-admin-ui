<script lang="ts">
    import PolicyRule from '$lib/components/policy-editor/PolicyRule.svelte';
    import RuleListItem from '$lib/components/policies/RuleListItem.svelte';
	import { formatPolicyForBunker, formatRuleMethod, kindToRule } from '$lib/components/policy-editor/utils';
	import { rpc } from '$lib/stores/ndk';
	import { currentUser, remoteBunkerPubkey } from '$lib/stores/user';
	import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';
	import { goto } from '$app/navigation';

    let policy: App.Policy = {
        name: '',
        description: '',
        createdBy: $currentUser?.hexpubkey()!,
        rules: []
    };

    function saveRule(e: CustomEvent<App.PolicyRule>) {
        const rule = e.detail;
        policy.rules.push(rule);
        policy = policy;
    }

    async function savePolicy() {
        const params = [ formatPolicyForBunker(policy) ];

        $rpc!.sendRequest($remoteBunkerPubkey!, 'create_new_policy', params, 24134, (cb: NDKRpcResponse) => {
            goto(`/policies`);
        });
    }

    let rule: App.PolicyRule;
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    <div class="flex flex-row items-center justify-between">
        <div class="text-2xl font-bold text-white">New Policy</div>
    </div>

    <label class="label">
        <span class="label-text">Name</span>
        <input bind:value={policy.name} type="text" class="input input-bordered" placeholder="Policy Name" />
    </label>

    <label class="label">
        <span class="label-text">Description (optional)</span>
        <input bind:value={policy.description} type="text" class="input input-bordered" placeholder="Description" />
    </label>

    <div class="flex flex-col gap-4">
        <div class="text-xl font-bold pb-2">
            Rules
        </div>

        <ul>
            {#each policy.rules as rule}
                <RuleListItem {rule} />
            {/each}
        </ul>


        <PolicyRule on:save={saveRule} bind:rule />
    </div>

    {#if !rule}
        <hr>

        <div class="flex flex-row items-center justify-between">
            <button class="
                btn variant-filled-primary
            " disabled={policy.rules.length === 0}
            on:click={savePolicy}
            >Save Policy</button>
        </div>
    {/if}
</div>