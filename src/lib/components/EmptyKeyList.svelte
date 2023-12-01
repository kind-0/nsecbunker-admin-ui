<div>
    <div class="flex flex-row items-center gap-4 text-zinc-1s00">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
        <p class="mt-1 text-lg">Here is where you can create or import your keys (nsecs) to be managed by this Bunker.</p>
    </div>
    <ul role="list" class="mt-6 grid grid-cols-1 gap-6 border-b border-t border-zinc-500 py-6">
        <li class="flow-root">
            <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-pink-500">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            </div>
            <div>
                <h3 class="text-sm font-medium text-zinc-400">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    <span>Target Key</span>
                </h3>
                <p class="mt-1 text-sm text-zinc-400/50">
                    These are the keys that this nsecBunker's users
                    will be signing as.
                </p>
            </div>
            </div>
        </li>
        <li class="flow-root">
            <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500">
                <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-zinc-400">
                        <span class="absolute inset-0" aria-hidden="true"></span>
                        <span>Users</span>
                    </h3>
                    <p class="mt-1 text-sm text-zinc-400/50">
                        Each key managed through your bunker can have one or
                        more users and clients.
                    </p>
                </div>
            </div>
        </li>
        <li class="flow-root">
            <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500">
                <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-green-500">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-sm font-medium text-zinc-400">
                        <span class="absolute inset-0" aria-hidden="true"></span>
                        <span>Tokens</span>
                    </h3>
                    <p class="mt-1 text-sm text-zinc-400/50">
                        Tokens allow you to grant access to keys with
                        a specific set of permissions and give the one-use
                        token to users to be redeemed for later.
                    </p>
                </div>
            </div>
        </li>
    </ul>
</div>

