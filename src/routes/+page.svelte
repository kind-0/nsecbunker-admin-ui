<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="mx-auto max-w-prose my-4 flex flex-col gap-8">
    <div class="text-3xl font-bold text-white">Welcome to your nsecBunker</div>

    <a class="block card card-hover hover:bg-slate-800 p-8" href="/keys">
        <div class="text-2xl font-bold text-white">Keys</div>
        <div class="text-zinc-400">Manage your target keys</div>
    </a>

    <a class="block card card-hover hover:bg-slate-800 p-8" href="/policies">
        <div class="text-2xl font-bold text-white">Policies</div>
        <div class="text-zinc-400">Create signing policies you can assign to different users</div>
    </a>

    <hr>

    <a class="block card p-8 cursor-not-allowed" href="/keys">
        <div class="text-2xl font-bold text-white">Events <span class="font-thin text-base">(coming soon)</span></div>
        <div class="text-zinc-400">Audit event logs</div>
    </a>

</div>