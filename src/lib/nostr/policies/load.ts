import {rpc as rpcStore} from '../../stores/ndk'
import { get as getStore } from 'svelte/store';
import type { NDKRpcResponse } from '@nostr-dev-kit/ndk';

export async function loadPolicies(remotePubkey: string): Promise<App.Policy[]> {
    const rpc = getStore(rpcStore);

    if (!rpc) throw new Error('RPC not initialized');

    const promise = new Promise<App.Policy[]>((resolve) => {
        // Send request for get_keys
        rpc.sendRequest(remotePubkey, 'get_policies', [], 24134, (response: NDKRpcResponse) => {
            console.log('get_policies response', response);

            const res = JSON.parse(response.result);
            resolve(res);
        });
    });

    return promise;
}
