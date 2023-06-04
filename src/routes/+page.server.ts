// import { sequelize, NostrEvent } from '$lib/server/db'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params: any }) {
    return {data: true};
};