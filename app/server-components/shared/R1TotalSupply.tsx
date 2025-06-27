import { fetchR1TotalSupply } from '@/lib/api/blockchain';
import { formatUnits } from 'viem';

export default async function R1TotalSupply() {
    const R1TotalSupply = await fetchR1TotalSupply();

    return (
        <div className="text-lg text-primary md:text-xl">
            {R1TotalSupply !== undefined
                ? `${parseFloat(Number(formatUnits(R1TotalSupply, 18)).toFixed(1)).toLocaleString()}`
                : '...'}
        </div>
    );
}
