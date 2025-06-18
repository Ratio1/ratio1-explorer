import { getLicenseFirstCheckEpoch } from '@/config';
import { getLicenseRewards } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../shared/cards/CardHorizontal';

export default async function LicenseRewards({
    license,
    licenseType,
    getNodeAvailability,
}: {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    getNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    let rewards: bigint | undefined = 0n;

    const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
        await getNodeAvailability();

    if (!nodeResponse) {
        return null;
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
            label="Rewards"
            value={
                <div className="text-primary">
                    {!!rewards ? '$R1 ' : ''}
                    {rewards === undefined
                        ? '...'
                        : parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(4)).toLocaleString()}
                </div>
            }
            isSmall
        />
    );
}
