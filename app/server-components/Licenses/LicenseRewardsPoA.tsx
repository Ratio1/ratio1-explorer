import { getLicenseFirstCheckEpoch } from '@/config';
import { getLicenseRewardsBreakdown } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import { SmallTag } from '../shared/SmallTag';

export default async function LicenseRewardsPoA({
    license,
    licenseType,
    licenseId,
    getNodeAvailability,
}: {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    getNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    try {
        const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
            await getNodeAvailability();

        if (!nodeResponse) {
            return null;
        }

        const firstCheckEpoch: number = getLicenseFirstCheckEpoch(license.assignTimestamp);
        const lastClaimEpoch: number = Number(license.lastClaimEpoch);

        const rewardsBreakdown = await getLicenseRewardsBreakdown(
            license,
            licenseType,
            BigInt(licenseId),
            nodeResponse.epochs.slice(lastClaimEpoch - firstCheckEpoch),
            nodeResponse.epochs_vals.slice(lastClaimEpoch - firstCheckEpoch),
        );

        const rewards = rewardsBreakdown.claimableAmount;
        const showMndBreakdown =
            licenseType !== 'ND' &&
            rewardsBreakdown.claimableAmount !== undefined &&
            ((rewardsBreakdown.carryoverAmount ?? 0n) > 0n || (rewardsBreakdown.withheldAmount ?? 0n) > 0n);

        return (
            <CardHorizontal
                label="Claimable PoA rewards:"
                value={
                    <div className="col items-end gap-1.5">
                        <div className="text-primary">
                            {rewards === undefined
                                ? '...'
                                : parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(2)).toLocaleString()}
                            {!!rewards ? ' $R1' : ''}
                        </div>

                        {showMndBreakdown && (
                            <div className="text-xs font-medium text-slate-500">
                                +{parseFloat(
                                    Number(formatUnits(rewardsBreakdown.carryoverAmount ?? 0n, 18)).toFixed(2),
                                ).toLocaleString()}{' '}
                                carryover,{' '}
                                {parseFloat(
                                    Number(formatUnits(rewardsBreakdown.withheldAmount ?? 0n, 18)).toFixed(2),
                                ).toLocaleString()}{' '}
                                withheld
                            </div>
                        )}
                    </div>
                }
                widthClasses="min-w-[280px]"
                isFlexible
                isSmall
            />
        );
    } catch (error) {
        console.log('Failed to fetch license rewards:', error);

        return (
            <CardHorizontal
                label="Rewards"
                value={<SmallTag variant="banned">Error loading rewards</SmallTag>}
                widthClasses="min-w-[280px]"
                isSmall
                isFlexible
            />
        );
    }
}
