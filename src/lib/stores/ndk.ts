import type NDK from '@nostr-dev-kit/ndk';
import type { NDKNostrRpc } from '@nostr-dev-kit/ndk';
import { writable } from 'svelte/store';

export const defaultExplicitRelayUrls = [
    'wss://relay.nsecbunker.com'
];

export const ndk = writable<NDK|undefined>();
export const rpc = writable<NDKNostrRpc | null>(null);