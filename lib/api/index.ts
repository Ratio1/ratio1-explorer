'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';

const oraclesApiURL = config.oraclesUrl;

export async function cachedGetActiveNodes(): Promise<types.OraclesDefaultResult> {
    const response: Response = await fetch(`${oraclesApiURL}/active_nodes_list`, {
        next: { revalidate: 60 }, // Revalidate every 1 minute
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
}
