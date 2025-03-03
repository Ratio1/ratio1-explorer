import config from '@/config';
import { fBI } from '@/lib/utils';

export const LicenseUsageStats = ({
    totalClaimedAmount,
    totalAssignedAmount = config.ndLicenseCap,
}: {
    totalClaimedAmount: bigint;
    totalAssignedAmount?: bigint;
}) => {
    if (!totalAssignedAmount) {
        return null;
    }

    return (
        <div className="row w-full gap-2.5 text-sm font-medium leading-none">
            <div>
                {fBI(totalClaimedAmount, 18)}/{fBI(totalAssignedAmount, 18)}
            </div>

            <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-300">
                <div
                    className="rounded-full bg-primary transition-all"
                    style={{ width: `${Number((totalClaimedAmount * 100n) / totalAssignedAmount)}%` }}
                ></div>
            </div>

            <div>{parseFloat(((Number(totalClaimedAmount) / Number(totalAssignedAmount)) * 100).toFixed(2))}%</div>
        </div>
    );
};
