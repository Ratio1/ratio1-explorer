import { getLicenseFirstCheckEpoch } from '@/config';
import { getLicenseRewards } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../shared/cards/CardHorizontal';

export default async function LicenseRewards({
    license,
    licenseType,
    cachedGetNodeAvailability,
}: {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    cachedGetNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    let rewards: bigint | undefined;

    const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
        await cachedGetNodeAvailability();

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
        <CardHorizontal
            label="Rewards"
            value={
                <div className="text-primary">
                    $R1 {rewards === undefined ? '...' : parseFloat(Number(formatUnits(rewards ?? 0n, 18)).toFixed(4))}
                </div>
            }
            isSmall
        />
    );
}
