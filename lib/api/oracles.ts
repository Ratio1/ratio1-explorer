'use server';

import * as types from '@/typedefs/blockchain';

const apiUrl = 'https://oracle-test.ratio1.ai'; // TODO:

export const getOraclesInfo = async (): Promise<types.OraclesDefaultResult> => {
    const response: Response = await fetch(`${apiUrl}/nodes_list`);

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
};
