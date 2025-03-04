'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';

const oraclesApiURL = config.oraclesUrl;
const PAGE_SIZE = 10;

export async function getActiveNodes(page: number = 1): Promise<types.OraclesDefaultResult> {
    const response: Response = await fetch(`${oraclesApiURL}/active_nodes_list?items_per_page=${PAGE_SIZE}&page=${page}`, {
        next: { revalidate: 60 }, // Revalidate every 1 minute
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
}
