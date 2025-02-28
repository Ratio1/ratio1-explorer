import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { LicensePageCardHeader } from '@/app/server-components/shared/Licenses/LicensePageCardHeader';
import { getNodeAvailability } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { LicensePageCardDetails } from './LicensePageCardDetails';

export default async function LicensePageCard({ licenseId, license }: { licenseId: string; license: types.License }) {
    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        nodeResponse = await getNodeAvailability(license.nodeAddress, license.assignTimestamp);
        console.log('[LicensePageCard]', nodeResponse);
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <CardBordered>
            <div className="col w-full">
                <LicensePageCardHeader
                    licenseId={licenseId}
                    license={license}
                    nodeAlias={nodeResponse.node_alias}
                    isNodeOnline={nodeResponse.node_is_online}
                />

                <LicensePageCardDetails license={license} nodeEpochs={nodeResponse.epochs_vals} />
            </div>
        </CardBordered>
    );
}
