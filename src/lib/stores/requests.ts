import type { NDKRpcRequest } from '@nostr-dev-kit/ndk';
import { writable } from 'svelte/store';

const _requestIds: string[] = [];
const _requestMap: Record<string, NDKRpcRequest> = {};

export const requestIds = writable(_requestIds);
export const requestMap = writable(_requestMap);
