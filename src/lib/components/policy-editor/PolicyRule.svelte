<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { kindToRule } from './utils';

    let rule: App.PolicyRule | undefined = { method: 'sign_event' };

    let method: App.PolicyMethod | 'dms' = 'sign_event';
    let kind: string | number;
    let manualKind: number | undefined;
    let useCount: number | undefined;
    let dispatch = createEventDispatcher();

    function savePolicy() {
        if (method === 'dms') {
            dispatch('save', { method: 'nip04_encrypt' });
            dispatch('save', { method: 'nip04_decrypt' });
            dispatch('save', { method: 'sign_event', kind: 4 });
        } else {
            if (kind === 'manual') {
                if (!manualKind) return;
                kind = manualKind;
            }

            dispatch('save', { method, kind, useCount: useCount ?? undefined });
        }

        rule = undefined;
    }

    function cancelNewPolicy() {
        rule = undefined;
    }

    const supportedKinds = [
        'all', 0, 1, 3, 4, 7, 9734, 9802, 10002, 30023, 31989
    ];

    let canLimitCount: boolean;
    let canSpecifyKind: boolean;

    $: {
        canLimitCount = method === 'sign_event';
        canSpecifyKind = method === 'sign_event';
        if (!canLimitCount) useCount = undefined;
    }
</script>

{#if !rule}
    <button type="button" class="btn variant-filled self-start" on:click={() => rule = { method: 'sign_event' }}>New Rule</button>
{:else}
    <label class="label">
        <span class="label-text">Method</span>
        <select bind:value={method} class="select px-4">
            <option value="sign_event">Sign Event</option>
            <option value="dms">Use DMs (encrypt, decrypt and send kind 4s)</option>
            <option value="nip04_encrypt">Encrypt</option>
            <option value="nip04_decrypt">Decrypt</option>
        </select>
    </label>

    {#if canSpecifyKind}
        <label class="label">
            <span class="label-text">Permission</span>
            <div class="flex flex-row gap-4">
                <select bind:value={kind} class="select px-4">
                    {#each supportedKinds as kind}
                        <option value={kind}>{kind}: {kindToRule(kind)}</option>
                    {/each}
                    <option value="manual">Manually specify:</option>
                </select>
                {#if kind === 'manual'}
                    <input bind:value={manualKind} type="number" class="input input-bordered" placeholder="Event kind number" />
                {/if}
        </label>
    {/if}

    {#if canLimitCount}
        <label class="label">
            <span class="label-text">Usage count</span>
            <input bind:value={useCount} type="number" class="input input-bordered" placeholder="Usage count" />
            <div class="text-xs">
                How many times can this permission be used? Leave empty for <em>unlimited</em>.
            </div>
        </label>
    {/if}

    <div class="flex flex-row items-center gap-4">
        <button type="button" class="btn variant-filled-primary" on:click={savePolicy}>Add Policy</button>
        <button type="button" class="btn variant-ghost" on:click={cancelNewPolicy}>Cancel</button>
    </div>
{/if}