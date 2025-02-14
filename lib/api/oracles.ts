'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';

const apiUrl = config.oraclesUrl;

export const getActiveNodes = async (): Promise<types.OraclesDefaultResult> => {
    const response: Response = await fetch(`${apiUrl}/active_nodes_list`);

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
};
