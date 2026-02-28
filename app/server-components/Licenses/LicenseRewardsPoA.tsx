import { getLicenseFirstCheckEpoch } from '@/config';
import { isOraclesSyncing } from '@/lib/oracles';
import { getLicenseRewardsBreakdown } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import { SmallTag } from '../shared/SmallTag';
import SyncingOraclesTag from '../shared/SyncingOraclesTag';

export default async function LicenseRewardsPoA({
    license,
    licenseType,
    licenseId,
    getNodeAvailability,
}: {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    getNodeAvailability: () => Promise<types.OraclesAvailabilityResult | undefined>;
}) {
    try {
        const nodeResponse: types.OraclesAvailabilityResult | undefined = await getNodeAvailability();

        if (!nodeResponse) {
            return null;
        }

        const syncingOracles = isOraclesSyncing(nodeResponse);
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
            (rewardsBreakdown.carryoverAmount ?? 0n) > 0n;

        return (
            <CardHorizontal
                label="Rewards (PoA)"
                value={
                    <div className="col items-end gap-1.5">
                        <div className="text-primary">
                            {rewards === undefined ? (
                                syncingOracles ? (
                                    <SyncingOraclesTag />
                                ) : (
                                    '...'
                                )
                            ) : (
                                parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(2)).toLocaleString()
                            )}
                            {!!rewards ? ' $R1' : ''}
                        </div>

                        {showMndBreakdown && (
                            <div className="text-xs font-medium text-slate-500">
                                includes{' '}
                                {parseFloat(
                                    Number(formatUnits(rewardsBreakdown.carryoverAmount ?? 0n, 18)).toFixed(2),
                                ).toLocaleString()}{' '}
                                carryover
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
