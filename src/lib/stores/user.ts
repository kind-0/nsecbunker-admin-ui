import { localStorageStore } from '@skeletonlabs/skeleton';
import { defaultExplicitRelayUrls } from './ndk';
import { writable } from 'svelte/store';
import type { NDKUser } from '@nostr-dev-kit/ndk';

export const remoteBunkerNpub = localStorageStore<string|null>('remoteBunkerNpub', null);
export const remoteBunkerPubkey = localStorageStore<string|null>('remoteBunkerPubkey', null);
export const bunkerRelays = localStorageStore<string[]>('bunkerRelays', defaultExplicitRelayUrls);
export const currentUser = writable<null|NDKUser>(null);