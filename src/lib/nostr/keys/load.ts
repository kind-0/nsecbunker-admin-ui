import {rpc as rpcStore} from '../../stores/ndk'
import { get as getStore } from 'svelte/store';
import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';

type Key = {
    name: string,
    npub: string,
};

export async function loadKeys(remotePubkey: string): Promise<Key[]> {
    const rpc = getStore(rpcStore);

    if (!rpc) throw new Error('RPC not initialized');

    const promise = new Promise<Key[]>((resolve) => {
        // Send request for get_keys
        rpc.sendRequest(remotePubkey, 'get_keys', [], 24134, (response: NDKRpcResponse) => { // 24134
            console.log('get_keys response', response);

            const res = JSON.parse(response.result);
            resolve(res);
        });
    });

    return promise;
}
