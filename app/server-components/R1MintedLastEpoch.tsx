import { getCurrentEpoch } from '@/config';
import { fetchR1MintedLastEpoch } from '@/lib/api/blockchain';
import { formatUnits } from 'viem';
interface CacheEntry {
    value: string;
    epoch: number;
    timestamp: number;
}

let cacheEntry: CacheEntry | null = null;
let fetchPromise: Promise<string> | null = null;

const getCachedR1MintedLastEpoch = async (): Promise<string> => {
    const currentEpoch = getCurrentEpoch();
    const now = Date.now();

    // Return cached value if still valid
    if (cacheEntry && cacheEntry.epoch === currentEpoch) {
        return cacheEntry.value;
    }

    // Prevent multiple concurrent fetches
    if (fetchPromise) {
        return fetchPromise;
    }

    fetchPromise = (async () => {
        try {
            const value = await fetchR1MintedLastEpoch();
            const valueString = value.toString();

            console.log('[R1MintedLastEpoch] Setting cache entry', {
                value: valueString,
                epoch: currentEpoch,
                timestamp: now,
            });

            cacheEntry = {
                value: valueString,
                epoch: currentEpoch,
                timestamp: now,
            };

            return valueString;
        } catch (error) {
            console.error('[R1MintedLastEpoch] error', error);
            throw error;
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};

export default async function R1MintedLastEpoch() {
    let value: bigint | undefined;

    try {
        const cachedValue = await getCachedR1MintedLastEpoch();
        console.log('[R1MintedLastEpoch] Getting cached value', cachedValue);
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
