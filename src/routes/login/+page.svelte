<script lang="ts">
	import { bunkerRelays } from '$lib/stores/user.js';
	import { goto } from "$app/navigation";
	import { defaultExplicitRelayUrls, ndk } from "$lib/stores/ndk";
    import { remoteBunkerNpub } from "$lib/stores/user";
	import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";

    let connectionString: string = '';

    interface ParsedURI {
        protocol: string;
        npub: string;
        relays?: string[];
    }

    function parseURI(uri: string): ParsedURI | null {
        const uriRegex = /^(.*?):\/\/([^@]*)?(?:@(.*?))?$/;
        const match = uri.match(uriRegex);

        if (!match) {
            return null;
        }

        const [, protocol, npub, relayStr] = match;
        const relays = relayStr ? decodeURIComponent(relayStr).split(',') : undefined;

        return {
            protocol: protocol.toLowerCase(),
            npub,
            relays: relays?.map(relay => `wss://`+relay.toLowerCase()),
        };
    }

    function decodeConnectionString(connectionString: string): [ string, string[]? ] {
        const parsedURI = parseURI(connectionString);

        if (!parsedURI) {
            throw new Error("Invalid connection string");
        }

        return [ parsedURI.npub, parsedURI.relays ];
    }

    function login() {
        const [ npub, relays ] = decodeConnectionString(connectionString);

        $remoteBunkerNpub = npub;
        $bunkerRelays = relays ?? defaultExplicitRelayUrls;
        try {
            $ndk = new NDK({
                explicitRelayUrls: relays,
                signer: new NDKNip07Signer()
            });
        } catch (e) {
            alert(e);
            return;
        }
        $ndk.connect(5000);

        goto("/");
    }
</script>

<div class="h-full w-full flex flex-col justify-center items-center gap-8">
    <h1 class="h1">
        nsecBunker Admin UI
    </h1>

    <p>
        Remotely administer your nsecBunker.
    </p>

    <div class="rounded-lg bg-white/10 p-8 flex flex-col w-full max-w-xl gap-4">
        <textarea bind:value={connectionString} class="
            rounded-lg
            input text-lg bg-white/70 w-full
            text-white resize-none font-mono
            h-36
        " placeholder="nsecBunker connection URL" />

        <button class="
            btn variant-filled-primary
            font-semibold text-lg
            bg-black text-white py-2
        " on:click={login}>
            Login
        </button>
    </div>

    {#if connectionString && parseURI(connectionString)?.protocol !== 'bunker'}
        <aside class="alert variant-ghost-error">
            <div class="alert-message">
                <p>
                    Invalid connection string
                </p>
            </div>
        </aside>
    {/if}

    <p class="text-center">
        Don't have an nsecBunker?
        <br>
        <a href="/new">
            Buy one here
        </a>
        or
        <a href="#">
            build your own.
        </a>
    </p>
</div>