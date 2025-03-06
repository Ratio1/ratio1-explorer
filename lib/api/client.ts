import config, { chain } from '@/config';
import { createPublicClient, http } from 'viem';

// TODO: Replace with a paid RPC at some point
export const publicClient = createPublicClient({
    chain,
    transport: http(
        `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3`,
    ),
});
