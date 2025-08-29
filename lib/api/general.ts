'use server';

import { TokenStatsResponse, TokenSupplyResponse } from '@/typedefs/general';

const dappApiUrl = 'https://dapp-api.ratio1.ai';

export async function getTokenSupply(): Promise<TokenSupplyResponse> {
    const response: Response | undefined = await fetch(`${dappApiUrl}/token/supply`, {
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token supply');
    }

    const data = await response.json();
    return data;
}

export async function getTokenStats(): Promise<TokenStatsResponse> {
    const response: Response | undefined = await fetch(`${dappApiUrl}/token/stats`, {
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token stats');
    }

    const data = await response.json();
    return data;
}
