import { getServerConfig } from '@/config/serverConfig';
import { fBI } from '@/lib/utils';

export default async function UsageStats({
    totalClaimedAmount,
    totalAssignedAmount,
}: {
    totalClaimedAmount: bigint;
    totalAssignedAmount?: bigint;
}) {
    if (!totalAssignedAmount) {
        return null;
    }

    const { config } = await getServerConfig();

    return (
        <div className="row w-full gap-2.5 text-sm font-medium leading-none">
            <div>
                {fBI(totalClaimedAmount, 18)}/{fBI(totalAssignedAmount || config.ndLicenseCap, 18)}
            </div>

            <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-300">
                <div
                    className="rounded-full bg-primary transition-all"
                    style={{ width: `${Number((totalClaimedAmount * 100n) / (totalAssignedAmount || config.ndLicenseCap))}%` }}
                ></div>
            </div>

            <div>
                {parseFloat(
                    ((Number(totalClaimedAmount) / Number(totalAssignedAmount || config.ndLicenseCap)) * 100).toFixed(2),
                )}
                %
            </div>
        </div>
    );
}
