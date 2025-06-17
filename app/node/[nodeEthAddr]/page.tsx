import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import NodeCard from '@/app/server-components/main-cards/NodeCard';
import NodePerformanceCard from '@/app/server-components/main-cards/NodePerformanceCard';
import { DetailedAlert } from '@/app/server-components/shared/DetailedAlert';
import { getServerConfig } from '@/config/serverConfig';
import { getNodeAvailability } from '@/lib/actions';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;
    const { config } = await getServerConfig();

    if (!nodeEthAddr || !isAddress(nodeEthAddr) || isEmptyETHAddr(nodeEthAddr)) {
        console.log(`[Node Page] Invalid node address: ${nodeEthAddr}`);
        notFound();
    }

    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        ({ nodeResponse } = await getCachedLicenseDetailsAndNodeAvailability(nodeEthAddr, config.environment));

        if (!nodeResponse) {
            console.log(`[Node Page] No node response found for address: ${nodeEthAddr}`);
            notFound();
        }
    } catch (error) {
        console.error(error);
        return {
            title: 'Error',
            openGraph: {
                title: 'Error',
            },
        };
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
        _environment: 'mainnet' | 'testnet' | 'devnet',
    ): Promise<{
        license: types.License;
        licenseId: bigint;
        licenseType: 'ND' | 'MND' | 'GND';
        owner: types.EthAddress;
        nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    }> => {
        let nodeAddress: types.EthAddress,
            totalAssignedAmount: bigint,
            totalClaimedAmount: bigint,
            lastClaimEpoch: bigint,
            assignTimestamp: bigint,
            lastClaimOracle: types.EthAddress,
            isBanned: boolean,
            licenseId: bigint,
            licenseType: 'ND' | 'MND' | 'GND' | undefined,
            owner: types.EthAddress;

        try {
            ({
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
            } = await getNodeLicenseDetails(nodeEthAddr));
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get node license details.');
        }

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
            owner,
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
    const { config } = await getServerConfig();

    if (!nodeEthAddr || !isAddress(nodeEthAddr) || isEmptyETHAddr(nodeEthAddr)) {
        console.log(`[Node Page] Invalid node address in page component: ${nodeEthAddr}`);
        notFound();
    }

    let license: types.License;
    let licenseId: bigint;
    let licenseType: 'ND' | 'MND' | 'GND';
    let owner: types.EthAddress;
    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        ({ license, licenseId, licenseType, owner, nodeResponse } = await getCachedLicenseDetailsAndNodeAvailability(
            nodeEthAddr,
            config.environment,
        ));
    } catch (error: any) {
        console.error(error);

        if (error.message.includes('Oracle state is not valid')) {
            return (
                <div className="center-all flex-1 py-4">
                    <DetailedAlert
                        icon={<RiCloseLine />}
                        title="Unexpected Error"
                        description={<div>Oracle state is not valid, please contact the development team.</div>}
                    />
                </div>
            );
        } else {
            console.log(`[Node Page] Error fetching node details for address: ${nodeEthAddr}`, error.message);
            notFound();
        }
    }

    return (
        <div className="responsive-col">
            <NodeCard nodeResponse={nodeResponse} />

            {licenseType && licenseId && (
                <LicenseCard
                    license={license}
                    licenseType={licenseType}
                    licenseId={licenseId.toString()}
                    owner={owner}
                    getNodeAvailability={() => Promise.resolve(nodeResponse)}
                    hasLink
                />
            )}

            <NodePerformanceCard nodeResponse={nodeResponse} />
        </div>
    );
}
