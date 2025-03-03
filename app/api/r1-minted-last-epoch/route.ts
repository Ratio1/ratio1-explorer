import { ERC20Abi } from '@/blockchain/ERC20';
import config, { getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import { getBlockByTimestamp, publicClient } from '@/lib/api/blockchain';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure API route is not cached

// Your function (moved from server component)
export async function fetchR1MintedLastEpoch() {
    const currentEpoch = getCurrentEpoch();
    const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
    const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

    const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
    const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

    const logs = await publicClient.getLogs({
        address: config.r1ContractAddress,
        event: ERC20Abi.find((v) => v.name === 'Transfer' && v.type === 'event')!,
        fromBlock,
        toBlock,
        args: {
            from: '0x0000000000000000000000000000000000000000',
        },
    });

    const value: bigint = logs.reduce((acc, log) => acc + BigInt(log.args.value ?? 0), 0n);
    return value;
}

export async function GET() {
    const value = await fetchR1MintedLastEpoch();
    return NextResponse.json({ value: value.toString() });
}
