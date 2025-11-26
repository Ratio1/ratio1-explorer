'use server';

import { chain } from '@/config';
import { createPublicClient, http, PublicClient } from 'viem';

if (!process.env.NEXT_PUBLIC_RPC) {
    throw new Error('NEXT_PUBLIC_RPC is not set');
}

const publicNodeRPC: string = process.env.NEXT_PUBLIC_RPC;

const publicNodeClient: PublicClient = createPublicClient({
    chain,
    transport: http(publicNodeRPC),
}) as PublicClient;

export const getPublicClient = async (): Promise<PublicClient> => {
    return publicNodeClient;
};
