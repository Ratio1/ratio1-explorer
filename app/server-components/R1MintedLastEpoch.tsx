import { getCurrentEpoch } from '@/config';
import { fetchR1MintedLastEpoch } from '@/lib/api/blockchain';
import { cache } from 'react';
import { formatUnits } from 'viem';

let cachedValue: string | null = null;
let cachedEpoch: number | null = null;

const getCachedR1MintedLastEpoch = cache(async () => {
    const currentEpoch = getCurrentEpoch();

    // Check if we have cached data for the current epoch
    if (cachedValue !== null && cachedEpoch === currentEpoch) {
        // console.log(`[R1MintedLastEpoch] using cached data for epoch ${currentEpoch}`);
        return cachedValue;
    }

    // console.log(`[R1MintedLastEpoch] fetching new data for epoch ${currentEpoch}`);
    const value = await fetchR1MintedLastEpoch();
    const valueString = value.toString();

    // console.log(`[R1MintedLastEpoch] fetched new data for epoch ${currentEpoch}, value: ${valueString}`);

    cachedValue = valueString;
    cachedEpoch = currentEpoch;

    return valueString;
});

export default async function R1MintedLastEpoch() {
    let value: bigint | undefined;

    try {
        const cachedValue = await getCachedR1MintedLastEpoch();
        value = BigInt(cachedValue);
    } catch (error) {
        console.log('[R1MintedLastEpoch] error', error);
        return <div className="text-lg text-slate-600 md:text-[19px]">—</div>;
    }

    return (
        <div className="text-lg text-primary md:text-[19px]">
            {value !== undefined ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(2)).toLocaleString()}` : '...'}
        </div>
    );
}
