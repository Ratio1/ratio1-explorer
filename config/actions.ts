'use server';

import { headers } from 'next/headers';
import { domains } from '.';

export async function getEnvServer(): Promise<'mainnet' | 'testnet' | 'devnet'> {
    const serverHost = (await headers()).get('host');
    console.log(`Server Host: ${serverHost}`, domains);

    return 'mainnet';
}
