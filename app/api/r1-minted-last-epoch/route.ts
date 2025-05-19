import { ERC20Abi } from '@/blockchain/ERC20';
import { getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import { getServerConfig } from '@/config/serverConfig';
import { getBlockByTimestamp } from '@/lib/api/blockchain';
import { getPublicClient } from '@/lib/api/client';
import { ETH_EMPTY_ADDR } from '@/lib/utils';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure API route is not cached

async function fetchR1MintedLastEpoch() {
    const { config } = await getServerConfig();

    const currentEpoch = getCurrentEpoch(config);
    const lastEpochStartTimestamp = getEpochStartTimestamp(config, currentEpoch - 1);
    const lastEpochEndTimestamp = getEpochStartTimestamp(config, currentEpoch);

    const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
    const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

    console.log(
        `Fetching R1 minted in last epoch: ${lastEpochStartTimestamp.toISOString()} - ${lastEpochEndTimestamp.toISOString()}, Block`,
        fromBlock,
        toBlock,
    );

    const publicClient = await getPublicClient();

    const logs = await publicClient.getLogs({
        address: config.r1ContractAddress,
        event: ERC20Abi.find((v) => v.name === 'Transfer' && v.type === 'event')!,
        fromBlock,
        toBlock,
        args: {
            from: ETH_EMPTY_ADDR,
        },
    });

    const value: bigint = logs.reduce((acc, log) => acc + BigInt(log.args.value ?? 0), 0n);
    return value;
}

export async function GET() {
    let value: bigint;

    try {
        value = await fetchR1MintedLastEpoch();
    } catch (error) {
        console.error('Error fetching R1 minted in last epoch:', error);
        return NextResponse.json({ error: 'Failed to fetch minted R1 data' }, { status: 500 });
    }

    return NextResponse.json({ value: value.toString() });
}
