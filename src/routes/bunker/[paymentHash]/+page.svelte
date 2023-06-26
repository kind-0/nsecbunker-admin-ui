<script lang="ts">
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import { clipboard } from '@skeletonlabs/skeleton';

    const {paymentHash} = $page.params;

    let interval;

    let LottiePlayer: any;

    onMount(async () => {
        checkBunkerStatus();
        interval = setInterval(() => {
            checkBunkerStatus();
        }, 2000);

        const module = await import("@lottiefiles/svelte-lottie-player");
        LottiePlayer = module.LottiePlayer;
    });

    let res;

    async function checkBunkerStatus() {
        const r = await fetch(`/api/bunker?id=${paymentHash}`);

        res = await r.json();
    }
</script>

<div class="h-full w-full flex flex-col justify-center items-center gap-8">
    <div class="flex flex-row gap-8 max-w-4xl">
        <div class="rounded-lg bg-white/10 p-8 flex flex-col w-full gap-8 items-center">
            {#if res?.connectionString}
                {#if LottiePlayer}
                    <div class="w-48 lg:w-w-96">
                        <LottiePlayer
                            src="https://assets9.lottiefiles.com/packages/lf20_atippmse.json"
                            autoplay={true}
                            loop={false}
                            controls={false}
                            renderer="svg"
                            background="transparent"
                        />
                    </div>
                {/if}
                <h1>Your bunker has been deployed</h1>

                <h4>
                    This is your connection string. You will need it to connect to administrate your bunker.
                </h4>

                <div class="font-mono p-4 bg-primary-800 rounded-lg whitespace-normal break-all">{res.connectionString}</div>
                <button use:clipboard={res.connectionString} class="btn variant-filled btn-sm">Copy</button>

                <a href="/login" class="btn variant-filled-primary text-lg font-bold px-14 py-4">
                    Login
                </a>

            {:else if res}
                {JSON.stringify(res)}
            {:else}
                Deploying Bunker...
            {/if}
        </div>
    </div>
</div>