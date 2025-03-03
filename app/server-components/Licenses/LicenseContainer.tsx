import { arrayAverage, getNodeAvailability, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import LicenseRow from './LicenseRow';

export default async function LicenseContainer({
    licenseId,
    licenseType,
    license,
}: {
    licenseId: string;
    licenseType: 'ND' | 'MND' | 'GND';
    license: types.License;
}) {
    let nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined;

    try {
        const isLinked = !isEmptyETHAddr(license.nodeAddress);

        if (isLinked) {
            nodeResponse = await getNodeAvailability(license.nodeAddress, license.assignTimestamp);
            console.log(`[License ${licenseId}] nodeResponse`, nodeResponse);
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <div className="col gap-3">
            <LicenseRow license={license} licenseType={licenseType} nodeResponse={nodeResponse} />

            {!!nodeResponse && (
                <div className="flex flex-wrap items-stretch gap-3">
                    <CardHorizontal
                        label="Last Epoch Availability"
                        value={`${parseFloat(((nodeResponse.epochs_vals[nodeResponse.epochs_vals.length - 1] * 100) / 255).toFixed(2))}%`}
                        isSmall
                        isFlexible
                    />

                    <CardHorizontal
                        label="Last Week Avg. Availability"
                        value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                        isSmall
                        isFlexible
                    />

                    <CardHorizontal
                        label="All Time Avg. Availability"
                        value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                        isSmall
                        isFlexible
                    />
                </div>
            )}
        </div>
    );
}
