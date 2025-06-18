'use server';

import config, { chain } from '@/config';
import { createPublicClient, http, PublicClient } from 'viem';

let publicClient: PublicClient | null = null;

export const getPublicClient = async () => {
    if (!publicClient) {
        // ! Replace with a paid RPC at some point
        publicClient = createPublicClient({
            chain,
            transport: http(
                `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            ),
        }) as PublicClient;
    }

    return publicClient;
};
