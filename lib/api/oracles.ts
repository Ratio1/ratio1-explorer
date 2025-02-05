'use server';

import * as types from '@/typedefs/blockchain';

const apiUrl = process.env.NEXT_PUBLIC_ORACLE_API_URL;

export const getOraclesInfo = async (): Promise<types.OraclesDefaultResult> => {
    const response: Response = await fetch(`${apiUrl}/nodes_list`);

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
};
