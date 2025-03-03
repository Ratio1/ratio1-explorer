import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { getNodeAvailability, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import LicensePageCardDetails from './LicensePageCardDetails';
import LicensePageCardHeader from './LicensePageCardHeader';

export default async function LicensePageCard({
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
            console.log(`[License ${licenseId}] Node`, nodeResponse);
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <CardBordered>
            <div className="col w-full">
                <LicensePageCardHeader licenseId={licenseId} license={license} nodeResponse={nodeResponse} />
                <LicensePageCardDetails license={license} licenseType={licenseType} nodeResponse={nodeResponse} />
            </div>
        </CardBordered>
    );
}
