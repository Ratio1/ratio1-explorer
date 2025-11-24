'use server';

import config, { chain } from '@/config';
import { createPublicClient, http, PublicClient } from 'viem';

if (!process.env.NEXT_PUBLIC_RPC) {
    throw new Error('NEXT_PUBLIC_RPC is not set');
}

if (!process.env.ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY is not set');
}

const publicNodeRPC: string = process.env.NEXT_PUBLIC_RPC;
const alchemyRPC: string = `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const publicNodeClient: PublicClient = createPublicClient({
    chain,
    transport: http(publicNodeRPC),
}) as PublicClient;

const alchemyClient: PublicClient = createPublicClient({
    chain,
    transport: http(alchemyRPC),
}) as PublicClient;

export const getPublicClient = async (): Promise<PublicClient> => {
    // 50/50 random selection
    return Math.random() < 0.5 ? publicNodeClient : alchemyClient;
};
