import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import NodeCard from '@/app/server-components/main-cards/NodeCard';
import NodePerformanceCard from '@/app/server-components/main-cards/NodePerformanceCard';
import { DetailedAlert } from '@/app/server-components/shared/DetailedAlert';
import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import config from '@/config';
import { getNodeAvailability } from '@/lib/actions';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { internalNodeAddressToEthAddress, isZeroAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { RiCloseLine } from 'react-icons/ri';
import { isAddress } from 'viem';

const resolveNodeEthAddress = (nodeAddress?: string): types.EthAddress | null => {
    if (!nodeAddress) {
        return null;
    }

    if (nodeAddress.startsWith('0xai_')) {
        try {
            const ethAddress = internalNodeAddressToEthAddress(nodeAddress);
            return isZeroAddress(ethAddress) ? null : ethAddress;
        } catch (error) {
            return null;
        }
    }

    if (!isAddress(nodeAddress) || isZeroAddress(nodeAddress)) {
        return null;
    }

    return nodeAddress;
};

export async function generateMetadata({ params }) {
    const { nodeAddr } = await params;
    const errorMetadata = {
        title: 'Error',
        openGraph: {
            title: 'Error',
        },
    };
    const resolvedNodeEthAddr = resolveNodeEthAddress(nodeAddr);

    if (!resolvedNodeEthAddr) {
        console.log(`[Node Page] Invalid node address: ${nodeAddr}`);
        return errorMetadata;
    }

    const canonical = `/node/${encodeURIComponent(nodeAddr)}`;
    const errorMetadataWithCanonical = {
        ...errorMetadata,
        alternates: {
            canonical,
        },
    };

    let nodeResponse: types.OraclesAvailabilityResult;

    try {
        ({ nodeResponse } = await fetchLicenseDetailsAndNodeAvailability(resolvedNodeEthAddr, config.environment));
    } catch (error) {
        console.error(error);
        return errorMetadataWithCanonical;
    }

    return {
        title: `Node • ${nodeResponse.node_alias}`,
        openGraph: {
            title: `Node • ${nodeResponse.node_alias}`,
        },
        alternates: {
            canonical,
        },
    };
}

const fetchLicenseDetailsAndNodeAvailability = async (
    nodeEthAddr: types.EthAddress,
    _environment: 'mainnet' | 'testnet' | 'devnet',
): Promise<{
    license: types.License;
    licenseId: bigint;
    licenseType: 'ND' | 'MND' | 'GND';
    owner: types.EthAddress;
    nodeResponse: types.OraclesAvailabilityResult;
}> => {
    let nodeAddress: types.EthAddress,
        totalAssignedAmount: bigint,
        totalClaimedAmount: bigint,
        awbBalance: bigint,
        firstMiningEpoch: bigint | undefined,
        lastClaimEpoch: bigint,
        assignTimestamp: bigint,
        lastClaimOracle: types.EthAddress,
        isBanned: boolean,
        licenseId: bigint,
        licenseType: 'ND' | 'MND' | 'GND' | undefined,
        owner: types.EthAddress,
        r1PoaiRewards: bigint,
        usdcPoaiRewards: bigint;

    try {
        ({
            nodeAddress,
            totalAssignedAmount,
            totalClaimedAmount,
            awbBalance,
            firstMiningEpoch,
            lastClaimEpoch,
            assignTimestamp,
            lastClaimOracle,
            isBanned,
            licenseId,
            licenseType,
            owner,
            r1PoaiRewards,
            usdcPoaiRewards,
        } = await getNodeLicenseDetails(nodeEthAddr));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get node license details.');
    }

    if (!licenseId || !licenseType) {
        console.log(`[Node Page] No license ID or type found for node: ${nodeEthAddr}`);
        throw new Error('No license ID or type found');
    }

    const license: types.License = {
        nodeAddress,
        totalAssignedAmount,
        totalClaimedAmount,
        awbBalance,
        firstMiningEpoch,
        lastClaimEpoch,
        assignTimestamp,
        lastClaimOracle,
        isBanned,
        owner,
        r1PoaiRewards,
        usdcPoaiRewards,
    };

    const nodeResponse = await getNodeAvailability(nodeEthAddr, assignTimestamp);

    return {
        license,
        licenseId,
        licenseType,
        owner,
        nodeResponse,
    };
};

export default async function NodePage({ params }) {
    const { nodeAddr } = await params;
    const resolvedNodeEthAddr = resolveNodeEthAddress(nodeAddr);

    if (!resolvedNodeEthAddr) {
        return <NotFound />;
    }

    let license: types.License;
    let licenseId: bigint;
    let licenseType: 'ND' | 'MND' | 'GND';
    let owner: types.EthAddress;
    let nodeResponse: types.OraclesAvailabilityResult;

    try {
        ({ license, licenseId, licenseType, owner, nodeResponse } = await fetchLicenseDetailsAndNodeAvailability(
            resolvedNodeEthAddr,
            config.environment,
        ));
    } catch (error: any) {
        console.error(error);

        if (error?.message?.includes('Oracle state is not valid')) {
            return (
                <div className="center-all flex-1 py-4">
                    <DetailedAlert
                        icon={<RiCloseLine />}
                        title="Unexpected Error"
                        description={<div>Oracle state is not valid, please contact the development team.</div>}
                    />
                </div>
            );
        }

        return <NotFound />;
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

function NotFound() {
    return (
        <ErrorComponent
            title="Node Not Found"
            description="The node you are looking for could not be found. The address might be incorrect, or the node may not exist on the network."
        />
    );
}
