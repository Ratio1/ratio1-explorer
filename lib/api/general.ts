'use server';

import { TokenSupplyResponse } from '@/typedefs/general';

const dappApiUrl = 'https://dapp-api.ratio1.ai';

export async function getTokenSupply(): Promise<TokenSupplyResponse> {
    let response: Response | undefined;

    try {
        response = await fetch(`${dappApiUrl}/token/supply`, {
            next: { revalidate: 300 },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch token supply');
    }
}
