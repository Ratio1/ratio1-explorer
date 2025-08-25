import { getLicenseFirstCheckEpoch } from '@/config';
import { getLicenseRewards } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../shared/cards/CardHorizontal';

export default async function LicenseRewardsPoA({
    license,
    licenseType,
    getNodeAvailability,
}: {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    getNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    try {
        let rewards: bigint | undefined = 0n;

        const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
            await getNodeAvailability();

        if (!nodeResponse) {
            return <CardHorizontal label="Rewards" value={<div className="text-red-600">Error loading rewards</div>} isSmall />;
        }

        const firstCheckEpoch: number = getLicenseFirstCheckEpoch(license.assignTimestamp);
        const lastClaimEpoch: number = Number(license.lastClaimEpoch);

        rewards = await getLicenseRewards(
            license,
            licenseType,
            nodeResponse.epochs.slice(lastClaimEpoch - firstCheckEpoch),
            nodeResponse.epochs_vals.slice(lastClaimEpoch - firstCheckEpoch),
        );

        return (
            <CardHorizontal
                label="Rewards (PoA)"
                value={
                    <div className="text-primary">
                        {!!rewards ? '$R1 ' : ''}
                        {rewards === undefined
                            ? '...'
                            : parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(3)).toLocaleString()}
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
                value={<div className="text-red-600">Error loading rewards</div>}
                widthClasses="min-w-[280px]"
                isSmall
                isFlexible
            />
        );
    }
}
