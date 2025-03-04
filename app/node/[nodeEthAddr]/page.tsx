import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import NodeCard from '@/app/server-components/main-cards/NodeCard';
import NodePerformanceCard from '@/app/server-components/main-cards/NodePerformanceCard';
import { DetailedAlert } from '@/app/server-components/shared/DetailedAlert';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { getNodeAvailability, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr) || isEmptyETHAddr(nodeEthAddr)) {
        notFound();
    }

    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        ({ nodeResponse } = await getCachedLicenseDetailsAndNodeAvailability(nodeEthAddr));

        if (!nodeResponse) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    return {
        title: `Node • ${nodeResponse.node_alias}`,
        openGraph: {
            title: `Node • ${nodeResponse.node_alias}`,
        },
    };
}

const getCachedLicenseDetailsAndNodeAvailability = cache(
    async (
        nodeEthAddr: types.EthAddress,
    ): Promise<{
        license: types.License;
        licenseId: bigint;
        licenseType: 'ND' | 'MND' | 'GND';
        owner: types.EthAddress;
        nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    }> => {
        const {
            nodeAddress,
            totalAssignedAmount,
            totalClaimedAmount,
            lastClaimEpoch,
            assignTimestamp,
            lastClaimOracle,
            isBanned,
            licenseId,
            licenseType,
            owner,
        } = await getNodeLicenseDetails(nodeEthAddr);

        if (!licenseId || !licenseType) {
            throw new Error('License not found.');
        }

        const license: types.License = {
            nodeAddress,
            totalAssignedAmount,
            totalClaimedAmount,
            lastClaimEpoch,
            assignTimestamp,
            lastClaimOracle,
            isBanned,
        };

        const nodeResponse = await getNodeAvailability(nodeEthAddr, assignTimestamp);

        return {
            license,
            licenseId,
            licenseType,
            owner,
            nodeResponse,
        };
    },
);

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr) || isEmptyETHAddr(nodeEthAddr)) {
        notFound();
    }

    let license: types.License;
    let licenseId: bigint;
    let licenseType: 'ND' | 'MND' | 'GND';
    let owner: types.EthAddress;
    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        ({ license, licenseId, licenseType, owner, nodeResponse } =
            await getCachedLicenseDetailsAndNodeAvailability(nodeEthAddr));
    } catch (error: any) {
        console.error(error);

        if (error.message.includes('Oracle state is not valid')) {
            return (
                <div className="center-all flex-1">
                    <DetailedAlert
                        icon={<RiCloseLine />}
                        title="Unexpected Error"
                        description={<div>Oracle state is not valid, please contact the development team.</div>}
                    />
                </div>
            );
        } else {
            notFound();
        }
    }

    return (
        <div className="col w-full flex-1 gap-6">
            <NodeCard nodeResponse={nodeResponse} />

            <LicenseCard
                license={license}
                licenseType={licenseType}
                licenseId={licenseId.toString()}
                owner={owner}
                getNodeAvailability={() => Promise.resolve(nodeResponse)}
                hasLink
            />

            <NodePerformanceCard nodeResponse={nodeResponse} />
        </div>
    );
}
