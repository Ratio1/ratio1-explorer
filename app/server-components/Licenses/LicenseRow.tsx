import { getLicenseFirstCheckEpoch } from '@/config';
import { getLicenseRewards } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { License } from '@/typedefs/blockchain';
import { RiCpuLine } from 'react-icons/ri';
import { formatUnits } from 'viem';
import { CardFlexible } from '../shared/cards/CardFlexible';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import { LicenseUsageStats } from '../shared/Licenses/LicenseUsageStats';

export default async function LicenseRow({
    license,
    licenseType,
    nodeResponse,
}: {
    license: License;
    licenseType: 'ND' | 'MND' | 'GND';
    nodeResponse?: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
}) {
    let rewards: bigint | undefined;

    if (nodeResponse) {
        const firstCheckEpoch: number = getLicenseFirstCheckEpoch(license.assignTimestamp);
        const lastClaimEpoch: number = Number(license.lastClaimEpoch);

        rewards = await getLicenseRewards(
            license,
            licenseType,
            nodeResponse.epochs.slice(lastClaimEpoch - firstCheckEpoch),
            nodeResponse.epochs_vals.slice(lastClaimEpoch - firstCheckEpoch),
        );
    } else {
        rewards = 0n;
    }

    return (
        <div className="flex flex-wrap items-stretch gap-3">
            <CardHorizontal
                label="Rewards"
                value={
                    <div className="text-primary">
                        $R1 {rewards === undefined ? '...' : parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(4))}
                    </div>
                }
                isSmall
            />

            <CardHorizontal
                label="Usage"
                value={
                    <div className="w-full min-w-60">
                        <LicenseUsageStats
                            totalClaimedAmount={license.totalClaimedAmount}
                            totalAssignedAmount={license.totalAssignedAmount}
                        />
                    </div>
                }
                isSmall
            />

            <CardFlexible isFlexible>
                <div className="row h-[76px] w-full justify-between gap-16 px-6 py-2">
                    <div className="row gap-2">
                        <div className="center-all rounded-full bg-blue-100 p-2.5 text-2xl text-primary">
                            <RiCpuLine />
                        </div>

                        <div className="text-[15px] font-medium leading-none text-slate-500">PoA</div>
                    </div>

                    <div className="col gap-[5px]">
                        <div className="text-[15px] font-medium leading-none text-slate-500">Remaining</div>
                        <div className="font-semibold leading-none">
                            {parseFloat(
                                Number(formatUnits(license.totalAssignedAmount - license.totalClaimedAmount, 18)).toFixed(2),
                            ).toLocaleString()}
                        </div>
                    </div>

                    <div className="col gap-[5px]">
                        <div className="text-[15px] font-medium leading-none text-slate-500">Initial amount</div>
                        <div className="font-semibold leading-none">
                            {parseFloat(Number(formatUnits(license.totalAssignedAmount ?? 0n, 18)).toFixed(2)).toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardFlexible>
        </div>
    );
}
