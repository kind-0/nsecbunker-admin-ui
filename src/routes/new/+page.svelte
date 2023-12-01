<script lang="ts">
    import { Stepper, Step, Accordion, AccordionItem, SlideToggle } from '@skeletonlabs/skeleton';
    import { NDKNip07Signer, type NDKUser } from '@nostr-dev-kit/ndk';
	import { browser } from '$app/environment';
    import { Avatar, Name } from '@nostr-dev-kit/ndk-svelte-components';
    import NDK from '@nostr-dev-kit/ndk';
	import { onMount } from 'svelte';
    import { createInvoice, checkInvoiceStatus } from '$lib/utils/lnbits.js';
    import QR from 'svelte-qr';
	import { goto } from '$app/navigation';

    const ndk = new NDK({
        explicitRelayUrls: [
            "wss://purplepag.es",
            "wss://relay.damus.io",
        ]
    });

    onMount(() => {
        ndk.connect();
    });

    let adminNpub: string = '';
    let userCount = 2;
    let clientsPerUser = 10;

    $: activeSeats = userCount * clientsPerUser;

    $: if (userCount <= 0) userCount = 1;

    async function getAdminNpubFromNip07() {
        const signer = new NDKNip07Signer();
        const user = await signer.user();
        adminNpub = user.npub;
    }

    function price(activeSeats: number) {
        if (testing) {
            return 1000;
        }

        return Math.round(activeSeats ** 1.8 * 350 / 1000) * 1000;
    }

    function formattedPrice(activeSeats: number): string {
        let priceInSats = price(activeSeats);

        if (priceInSats >= 1000000) {
            // Format in millions
            const millions = (priceInSats / 1000000).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: priceInSats % 1000000 === 0 ? 0 : 2,
            });
            return `${millions}M`;
        } else if (priceInSats >= 1000) {
            // Format in thousands
            const thousands = (priceInSats / 1000).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: priceInSats % 1000 === 0 ? 0 : 2,
            });
            return `${thousands}k`;
        } else {
            // Format as is
            return `${priceInSats}`;
        }
    }

    let nip07Detected = false;

    $: nip07Detected = browser && !!window.nostr;

    let currentPage = 0;

    let invoice: any;

    async function getInvoice(amount: number) {
        const promise = new Promise((resolve, reject) => {
            createInvoice(amount).then((i) => {
                invoice = i
                resolve(invoice);
                checkInvoice();
            });
        });

        return promise;
    }

    let paymentReceived = false;

    async function deployBunker() {
        const res = await fetch('/api/bunker', {
            method: 'POST',
            headers: {
                'Authorization': invoice.payment_hash,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminNpubs: adminNpub.split(/[\n|,]/),
                maxSeats: activeSeats,
            }),
        })

        // get id from json
        const { id } = await res.json();
        goto(`/bunker/${id}`);
    }

    async function checkInvoice() {
        const promise = new Promise((resolve, reject) => {
            checkInvoiceStatus(invoice).then((status) => {
                if (status.paid) {
                    paymentReceived = true;
                    resolve(true);
                } else {
                    setTimeout(checkInvoice, 1000);
                }
            });
        });

        return promise;
    }

    let testing = false;
</script>

<div class="h-full w-full flex flex-col justify-center items-center gap-8">
    <div class="flex flex-row gap-8 max-w-4xl">
        <div class="rounded-lg bg-white/10 p-8 flex flex-col w-full gap-4">
            <Stepper
                start={currentPage}
                on:back={() => {currentPage--;}}
                on:next={() => {currentPage++;}}
                on:complete={deployBunker}
                buttonCompleteLabel="Deploy Bunker"
            >
                <Step>
                    <svelte:fragment slot="header">New nsecBunker</svelte:fragment>

                    <p>
                        This wizard will guide you through the process of deploying a new nsecBunker.
                    </p>
                </Step>

                <!-- <Step>
                    <svelte:fragment slot="header">Target key</svelte:fragment>

                    <p>The <em>target</em> key in nsecBunker is the key you would like to sign as.</p>

                    <p>If you are managing the keys for a company, the company's key is the target key.</p>
                </Step> -->

                <Step locked={!adminNpub}>
                    <svelte:fragment slot="header">Administrator(s)</svelte:fragment>

                    <p>
                        Enter the npubs of the people you would like to be able to manage this nsecBunker.
                    </p>

                    <div class="relative">
                        <textarea bind:value={adminNpub} class="
                            rounded-lg
                            input text-lg bg-white/70 w-full
                            text-white resize-none font-mono
                            h-36
                        " placeholder="admin npubs" />

                        {#if nip07Detected}
                            <button class="
                                btn variant-filled-primary text-sm
                                absolute right-4 bottom-4
                            " on:click={getAdminNpubFromNip07}>
                                Get from nostr extension
                            </button>
                        {/if}
                    </div>
                </Step>

                <Step>
                    <svelte:fragment slot="header">People</svelte:fragment>

                    <p>
                        How many different people will be able to sign with this nsecBunker?
                    </p>

                    <input type="number" bind:value={userCount} class="
                        rounded-lg
                        input text-lg bg-white/70 w-full
                        text-white resize-none font-mono
                        h-12" placeholder="Number of users" />

                    <Accordion class="hidden">
                        <AccordionItem>
                            <svelte:fragment slot="summary">Advanced options</svelte:fragment>
                            <svelte:fragment slot="content">
                                <p>
                                    How many clients might each user use?
                                </p>

                                <p class="p-4 bg-secondary-900">
                                    Each user's client uses it's own key; typically 10 or 15 is a safe number.
                                    (E.g. Peter's Coracle, Peter's Snort, Peter's Damus, etc.)
                                </p>

                                <input type="number" bind:value={clientsPerUser} class="
                                    rounded-lg
                                    input text-lg bg-white/70 w-full
                                    text-white resize-none font-mono
                                    h-12" placeholder="Clients per user" />
                            </svelte:fragment>
                        </AccordionItem>
                    </Accordion>

                    <SlideToggle
                        name="slide"
                        bind:checked={testing}
                        active="bg-primary-500"
                    >
                        <b class="text-lg">Just testing?</b>
                        <span class="text-sm font-thin">Deploy a bunker for 1-hour.</span>
                    </SlideToggle>

                    <p class="py-4 !text-2xl">
                        <b>Price:</b>

                        {#key testing}
                            <span class="text-green-500">
                                {formattedPrice(activeSeats)} sats
                                {#if testing}
                                    / one hour
                                {:else}
                                    / year
                                {/if}
                            </span>
                        {/key}
                    </p>
                </Step>

                <Step locked={!paymentReceived}>
                    <svelte:fragment slot="header">
                        {#if paymentReceived}
                            Payment Received
                        {:else}
                            <b>Price:</b>

                            <span class="font-normal text-green-500">
                                {formattedPrice(activeSeats)} sats / year
                            </span>
                        {/if}
                    </svelte:fragment>

                    {#if !paymentReceived}
                        {#await getInvoice(price(activeSeats))}
                            <div class="my-4">
                                Creating invoice
                            </div>
                        {:then invoice}
                            <div class="bg-white rounded-md w-64 h-64">
                                <QR text={`lightning:${invoice.payment_request}`} />
                            </div>
                            <a href="lightning:{invoice.payment_request}" class="btn variant-filled-surface w-full">⚡️ Open in wallet</a>

                            <div class="flex flex-row gap-2">
                                Waiting for payment

                                <button class="btn btn-sm variant-outline-primary" on:click={checkInvoice}>Check now</button>
                            </div>
                        {:catch error}
                            <div class="my-4">
                                Error creating invoice
                            </div>
                        {/await}
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-green-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    {/if}
                </Step>
            </Stepper>
        </div>

        <div class="lg:w-2/5 flex flex-col gap-8">
            {#if currentPage === 1}
                <div class="p-4 bg-secondary-900 flex flex-col gap-4">
                    The nsecBunker admins will be able to add and remove users and manage
                    the policies by which users can use the nsecBunker-managed keys.
                </div>

                <div class="p-4 bg-secondary-900">
                    The <b>admin npub</b> can, but does not have to be, the same as the <b>target key</b>
                    that you will be signing as.
                </div>
            {:else if currentPage === 2}
            <p class="p-4 bg-secondary-900">
                Users are the different people that will be using the target key
                stored. (E.g. Peter, Jane, Jack, etc.)
            </p>
            {/if}
        </div>
    </div>
</div>