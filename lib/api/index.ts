'use server';

import config, { PAGE_SIZE } from '@/config';
import * as types from '@/typedefs/blockchain';

export async function getActiveNodes(
    page: number = 1,
    pageSize: number = PAGE_SIZE,
    alias_pattern?: string,
): Promise<types.OraclesDefaultResult> {
    const oraclesApiURL = config.oraclesUrl;

    const response: Response = await fetch(
        `${oraclesApiURL}/active_nodes_list?items_per_page=${pageSize}&page=${page}${alias_pattern ? `&alias_pattern=${alias_pattern}` : ''}`,
        {
            next: { revalidate: 60 },
        },
    );

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
}
