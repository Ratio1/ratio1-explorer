import config, { getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import { getBlockByTimestamp } from '@/lib/api/blockchain';
import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic'; // Ensure API route is not cached

async function fetchR1MintedLastEpoch() {
    const currentEpoch = getCurrentEpoch();
    const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
    const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

    const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
    const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

    const alchemyUrl = `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

    console.error('R1MintedLastEpoch alchemyUrl', alchemyUrl);

    const res = await fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getAssetTransfers',
            params: [
                {
                    fromBlock: `0x${fromBlock.toString(16)}`,
                    toBlock: `0x${toBlock.toString(16)}`,
                    fromAddress: '0x0000000000000000000000000000000000000000',
                    contractAddresses: [config.r1ContractAddress],
                    category: ['erc20'],
                    withMetadata: false,
                },
            ],
        }),
    });

    console.error('R1MintedLastEpoch res', res.statusText);
    console.error('R1MintedLastEpoch res', res.text);

    const data = await res.json();
    const transfers = data.result?.transfers ?? [];

    const value = transfers.reduce((acc: bigint, t: any) => {
        try {
            return acc + BigInt(t.rawContract.value ?? '0');
        } catch {
            return acc;
        }
    }, 0n);

    return value;
}

export async function GET() {
    let value: bigint;

    try {
        value = await fetchR1MintedLastEpoch();
    } catch (error) {
        console.error('Error fetching R1 minted last epoch:', error);
        return NextResponse.json({ error: 'Failed to fetch minted R1 data' }, { status: 500 });
    }

    return NextResponse.json({ value: value.toString() });
}
