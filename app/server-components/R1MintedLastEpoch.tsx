import { fetchR1MintedLastEpoch } from '@/lib/api/blockchain';
import { cache } from 'react';
import { formatUnits } from 'viem';

// Enable page-level caching
export const revalidate = 60;
export const dynamic = 'force-dynamic';

const fetchCachedR1MintedLastEpoch = cache(async () => {
    const value: bigint = await fetchR1MintedLastEpoch();
    return value;
});

export default async function R1MintedLastEpoch() {
    let value: bigint | undefined;

    try {
        value = await fetchCachedR1MintedLastEpoch();
    } catch (error) {
        console.log('[R1MintedLastEpoch] error', error);
        return <div className="text-lg text-slate-600 md:text-xl">—</div>;
    }

    return (
        <div className="text-lg text-primary md:text-xl">
            {value !== undefined ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(2)).toLocaleString()}` : '...'}
        </div>
    );
}
