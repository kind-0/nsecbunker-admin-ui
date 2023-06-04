<script lang="ts">
	import { formatRuleMethod, kindToRule } from "$lib/components/policy-editor/utils";
	import { rpc } from "$lib/stores/ndk";
	import { requestIds, requestMap } from "$lib/stores/requests";
	import { NDKUser, type NDKRpcRequest, NDKEvent } from "@nostr-dev-kit/ndk";
	import { type ModalSettings, modalStore } from "@skeletonlabs/skeleton";

    export let request: NDKRpcRequest;
    const payload = JSON.parse(request.params[0]);
    const description = payload.description;
    let remoteUser = new NDKUser({hexpubkey: payload.remotePubkey});
    let allowScope = {};

    function alwaysAllowCurrentKind() {
        allowScope = { kind: event?.kind };

        alwaysAllow();
    }

    function alwaysAllow() {
        new Promise<boolean>((resolve) => {
            // If we already have a name, we don't need to ask for one
            if (description) {
                resolve(description);
                return;
            }

            const modal: ModalSettings = {
                type: 'prompt',
                // Data
                title: 'Name for this key',
                body: 'Provide a name for this key that you will recognize later',
                // Populates the input value and attributes
                value: 'Snort',
                valueAttr: { type: 'text', minlength: 1, maxlength: 100, required: true },
                // Returns the updated response value
                response: resolve,
            };
            modalStore.trigger(modal);
        }).then((name: any) => {
            $rpc!.sendResponse(
                request.id,
                request.pubkey,
                JSON.stringify(['always', name, allowScope]),
                24134)

            allowScope = {};

            $requestIds = $requestIds.filter((id) => id !== request.id);
            delete $requestMap[request.id];
            $requestIds = [...$requestIds];
        });
    }

    let event: NDKEvent | undefined;

    if (payload.method === 'sign_event') {
        try {
            event = new NDKEvent(undefined, JSON.parse(payload.param));
        } catch (e) {
            console.error(e);
        }
    }
</script>

<div class="my-4">
    <p class="text-2xl unstyled font-bold text-white">Permission request</p>

    <p class="my-2">
        Remote
        {#if description}
            client: <span class="text-white text-xl font-semibold">{description}</span>
            <span class="text-xs font-thin opacity-80">({remoteUser.npub})</span>
        {:else}
            npub: {remoteUser.npub}
        {/if}
        wants to
        <em>{formatRuleMethod(payload.method)}</em>
        with key
        <em>{payload.keyName}</em>
    </p>

    {#if payload.method === 'sign_event'}
        {#if event?.kind}
            <div class="text-white font-semibold">Event kind: {event.kind} ({kindToRule(event.kind)})</div>
        {/if}

        {#if event?.content && event?.content?.length > 0}
            <div class="text-white font-semibold">Content: {event.content.slice(0, 100)}</div>
        {/if}

        <pre class="bg-white/10 p-4 rounded-md whitespace-pre-wrap">{payload.param}</pre>
    {/if}

    <div class="flex flex-row items-center gap-4">
        {#if payload.method === 'sign_event' && event}
            <button class="
                bg-green-700
                px-4 py-2 rounded-md
            "
                on:click={alwaysAllowCurrentKind}
            >Always allow singing kind {event.kind}</button>

            <button class="
                bg-green-700
                px-4 py-2 rounded-md
            "
                on:click={alwaysAllow}
            >Always allow singing all kinds</button>
        {:else}
            <button class="
                bg-green-700
                px-4 py-2 rounded-md
            "
                on:click={alwaysAllow}
            >Always allow</button>
        {/if}
    </div>
</div>