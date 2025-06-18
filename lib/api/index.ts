'use server';

import * as types from '@/typedefs/blockchain';

const PAGE_SIZE = 10;

export async function getActiveNodes(page: number = 1): Promise<types.OraclesDefaultResult> {
    const oraclesApiURL = config.oraclesUrl;

    const response: Response = await fetch(`${oraclesApiURL}/active_nodes_list?items_per_page=${PAGE_SIZE}&page=${page}`, {
        next: { revalidate: 60 }, // Revalidate every 1 minute
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
}

export async function pingBackend(): Promise<boolean> {
    const backendApiURL = config.backendUrl;

    let response: Response | undefined;

    try {
        response = await fetch(`${backendApiURL}/auth/nodeData`);
    } catch (error) {
        console.error(error);
        return false;
    }

    return !!response && response.status === 200;
}
