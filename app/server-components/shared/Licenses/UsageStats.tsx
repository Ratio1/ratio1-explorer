import config from '@/config';
import { fBI } from '@/lib/utils';

export default async function UsageStats({
    totalClaimedAmount,
    totalAssignedAmount,
    awbBalance = 0n,
}: {
    totalClaimedAmount: bigint;
    totalAssignedAmount?: bigint;
    awbBalance?: bigint;
}) {
    if (!totalAssignedAmount) {
        return null;
    }

    const denominator = totalAssignedAmount || config.ndLicenseCap;
    const walletClaimedAmount = totalClaimedAmount > awbBalance ? totalClaimedAmount - awbBalance : 0n;
    const walletClaimedPercentage = Number((walletClaimedAmount * 100n) / denominator);
    const awbPercentage = Number((awbBalance * 100n) / denominator);
    const walletClaimedPercentageScaled = (walletClaimedAmount * 10_000n) / denominator; // percentage with 2 decimal places, scaled by 100
    const walletClaimedPercentageLabel = Number(walletClaimedPercentageScaled) / 100;

    return (
        <div className="row w-full gap-2.5 text-sm font-medium leading-none">
            <div>{`${fBI(walletClaimedAmount, 18)}/${fBI(denominator, 18)}`}</div>

            <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-300">
                <div className="rounded-full bg-primary transition-all" style={{ width: `${walletClaimedPercentage}%` }}></div>
                {awbBalance > 0n && <div className="bg-orange-500 transition-all" style={{ width: `${awbPercentage}%` }}></div>}
            </div>

            <div>{walletClaimedPercentageLabel}%</div>
        </div>
    );
}
