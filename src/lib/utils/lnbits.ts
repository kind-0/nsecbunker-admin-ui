import _LNBits from "lnbits";

let LNBits: any;

if (_LNBits.default) {
    LNBits = _LNBits.default;
} else {
    LNBits = _LNBits;
}

function getWallet () {
    return LNBits({
        adminKey: "",
        invoiceReadKey: '1b68362815324e63bcf708174f7d0851',
        endpoint: 'https://legend.lnbits.com'
    });
}

export async function createInvoice(amount: number) {
    const { wallet } = getWallet();

    const newInvoice = await wallet.createInvoice({
        amount: amount,
        memo: 'nsecBunker',
        out: false,
    });

    return newInvoice;
}

export async function checkInvoiceStatus(invoice) {
    const { wallet, userManager, paywall, withdraw, paylink, tpos } = getWallet();
    const invoiceStatus = await wallet.checkInvoice({
        payment_hash: invoice.payment_hash,
    });

    return invoiceStatus;
}