'use server';

import { getServerConfig } from '@/config/getServerConfig';
import { createPublicClient, http, PublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';

let publicClient: PublicClient | null = null;

export const getPublicClient = async () => {
    if (!publicClient) {
        const { environment } = await getServerConfig();
        const chain = environment === 'mainnet' ? base : baseSepolia;

        // ! Replace with a paid RPC at some point
        publicClient = createPublicClient({
            chain,
            transport: http(
                `https://base-${environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3`,
            ),
        }) as PublicClient;
    }

    return publicClient;
};
