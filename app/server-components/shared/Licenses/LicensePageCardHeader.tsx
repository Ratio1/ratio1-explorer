import * as types from '@/typedefs/blockchain';
import { FunctionComponent, PropsWithChildren } from 'react';
import LicensePageCardNode from './LicensePageCardNode';
import { LicenseSmallCard } from './LicenseSmallCard';

export default async function LicensePageCardHeader({
    licenseId,
    license,
    nodeResponse,
}: {
    licenseId: string;
    license: types.License;
    nodeResponse?: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
}) {
    const getLicenseCard = () => (
        <LicenseSmallCard
            licenseId={Number(licenseId)}
            licenseType={undefined} // No need to display license type here
            totalAssignedAmount={license.totalAssignedAmount}
            totalClaimedAmount={license.totalClaimedAmount}
        />
    );

    const getBannedLicenseTag = () => <Tag>Banned</Tag>;

    return (
        <div className="larger:flex-row larger:items-center flex w-full flex-col-reverse justify-between gap-4 rounded-bl-2xl rounded-br-2xl bg-white px-6 py-6 md:gap-6 lg:gap-8">
            <div className="row flex-1 flex-wrap gap-2 sm:gap-4">
                {getLicenseCard()}

                {!!nodeResponse && (
                    <LicensePageCardNode
                        nodeAddress={license.nodeAddress}
                        nodeAlias={nodeResponse.node_alias}
                        isNodeOnline={nodeResponse.node_is_online}
                    />
                )}
            </div>

            <div className="flex justify-end">{license.isBanned && <>{getBannedLicenseTag()}</>}</div>
        </div>
    );
}

const Tag: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <div className="flex">
        <div className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600">{children}</div>
    </div>
);
