import { json } from '@sveltejs/kit';
import { checkInvoiceStatus } from '../../../lib/utils/lnbits.js';
import { createContainer, checkContainer, getContainerFileContent } from '../../../lib/utils/docker.js';

export async function POST({ request }) {
    try {
        const paymentHash = request.headers.get('authorization');
        const { adminNpubs } = await request.json();

        if (!paymentHash) return json({ok: false}, { status: 400 });

        const authorization = await checkInvoiceStatus({payment_hash: paymentHash});

        if (!authorization.paid) {
            return json({ok: false}, { status: 402 });
        }

        let containerId = await checkContainer(paymentHash);
        if (!containerId) {
            containerId = await createContainer(adminNpubs, 2, paymentHash);
        }

        return json({id: containerId }, { status: 201 });
    } catch (err) {
        console.error(err);
        return json({ok: false}, { status: 500 });
    }
}

export async function GET({ request, params, url }) {
    const id = url.searchParams.get('id');
    const connectionString = await getContainerFileContent(id, '/app/connection.txt');

    return json({ok: true, connectionString }, { status: 201 });
}