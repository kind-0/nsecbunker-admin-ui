<script lang="ts">
	import { RetryTimeoutError, withRetry } from "$lib/utils/with-retry";
	import { onMount } from "svelte";
    import { toastStore } from '@skeletonlabs/skeleton';

    type onAbort = () => void;

    export let promiseCreator: () => Promise<any>;
    export let retryCount: number = 3;
    export let timeout: number = 1000;
    export let onAbort: undefined | onAbort = undefined;

    let promise: Promise<any>;
    let retrying: number | undefined;

    function onRetry(retryCount: number) {
        retrying = retryCount;
    }

    onMount(() => {
        promise = withRetry(
            promiseCreator,
            {
                retryCount,
                timeout,
                onRetry,
                onAbort
            }
        );
    });
</script>

{#if promise}
    {#await promise}
        {#if $$slots.loading}
            <slot name="loading" {retrying} />
        {:else}
            <p>Loading...</p>

            {#if retrying}
                <aside class="alert variant-outline-warning">
                    <div class="alert-message">
                        <p>This is taking longer than expected.</p>
                        <p>Retrying {retrying}/{retryCount}</p>
                    </div>
                </aside>

            {/if}
        {/if}
    {:then value}
        <slot {value} />
    {:catch error}
        {#if error instanceof RetryTimeoutError}
            {#if $$slots.timeoutError}
                <slot name="timeoutError" {error} />
            {:else}
                <aside class="alert variant-filled-error">
                    <div class="alert-message">
                        <h3 class="h3">Unreachable nsecBunker</h3>
                        <p>
                            The nsecBunker is not reachable. Please make sure it is running and try again.
                        </p>

                        <h4 class="pt-6">Keep in mind:</h4>

                        <p>
                            <b>The nsecBunker <em>only</em> responds to the designated administrator keys;</b>
                            <br>👉
                            are you certain you are using the correct <span class="font-mono">npub</span> in this browser to try
                            to reach it?
                        </p>
                    </div>
                </aside>
            {/if}
        {:else}
            <p>Failed: #{error.message}</p>
        {/if}
    {/await}
{/if}