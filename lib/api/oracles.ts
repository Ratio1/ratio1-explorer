'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';

const apiUrl = config.oraclesUrl;

export const getOraclesInfo = async (): Promise<types.OraclesDefaultResult> => {
    console.log('getOraclesInfo');
    const response: Response = await fetch(`${apiUrl}/nodes_list`);

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
};
