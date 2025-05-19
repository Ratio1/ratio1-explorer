'use server';

import { headers } from 'next/headers';
import { Config, configs, getEnvironment } from '.';

export async function getServerConfig(): Promise<{
    config: Config;
    environment: 'mainnet' | 'testnet' | 'devnet';
}> {
    const hostname: string | null = (await headers()).get('host');
    const environment: 'mainnet' | 'testnet' | 'devnet' = getEnvironment(hostname);

    return {
        config: configs[environment],
        environment,
    };
}

export async function getServerURL(): Promise<string> {
    const hostname: string = (await headers()).get('host') || 'localhost:3000';
    const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
    const url = `${protocol}://${hostname}`;

    return url;
}
