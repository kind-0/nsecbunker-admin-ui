<script lang="ts">
	import { onMount } from "svelte";

    export let keyName: string;

    let LottiePlayer;

    onMount(async () => {
        const module = await import("@lottiefiles/svelte-lottie-player");
        LottiePlayer = module.LottiePlayer;

    });
</script>

<div>
    <div class="flex flex-row items-center gap-4 text-zinc-1s00">
        <div class="w-32 h-32">
            {#if LottiePlayer}
                <LottiePlayer
                    src="https://assets4.lottiefiles.com/packages/lf20_ALIsoI.json"
                    autoplay={true}
                loop={false}
                controls={false}
                renderer="svg"
                background="transparent"
                />
            {/if}
        </div>
        <p class="mt-1 text-lg">You've created your first key!</p>
    </div>

    <h2 class="h2 lg:pt-10">Things to check out next</h2>

    <ul role="list" class="mt-6 grid grid-cols-1 gap-6 border-b border-t border-zinc-500 py-6">
        <li class="flow-root">
            <a href='/policies' class="unstyled block px-4 hover:bg-white/10 rounded-lg transition-all duration-200">
                <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500">
                    <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500">
                        <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-zinc-400">
                            <span class="absolute inset-0" aria-hidden="true"></span>
                            <span class="text-white">Policies</span>
                        </h3>
                        <p class="mt-1 text-sm text-zinc-400/50">
                            Each key managed through your bunker can have one or
                            more users and clients.
                        </p>
                    </div>
                </div>
            </a>
        </li>
        <li class="flow-root">
            <a href={`/keys/${keyName}/tokens`} class="unstyled block px-4 hover:bg-white/10 rounded-lg transition-all duration-200">
                <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500">
                    <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-green-500">
                        <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-zinc-400">
                            <span class="absolute inset-0" aria-hidden="true"></span>
                            <span class="text-white">Tokens</span>
                        </h3>
                        <p class="mt-1 text-sm text-zinc-400/50">
                            Tokens allow you to grant access to keys with
                            a specific set of permissions and give the one-use
                            token to users to be redeemed for later.
                        </p>
                    </div>
                </div>
            </a>
        </li>
    </ul>
</div>

