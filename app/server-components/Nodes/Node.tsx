import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import NodeListNodeCard from './NodeListNodeCard';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    let licenseId: bigint,
        licenseType: 'ND' | 'MND' | 'GND' | undefined,
        owner: string,
        totalAssignedAmount: bigint,
        totalClaimedAmount: bigint,
        isBanned: boolean;

    try {
        ({ licenseId, licenseType, owner, totalAssignedAmount, totalClaimedAmount, isBanned } = await getNodeLicenseDetails(
            node.eth_addr,
        ));

        // Omit the GND as it's pinned to be displayed on top of the list (1st page)
        if (licenseType === 'GND') {
            return null;
        }

        if (!licenseId || !licenseType) {
            console.log('[Node] No license found for node', node.eth_addr);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <NodeListNodeCard
            ratio1Addr={ratio1Addr}
            node={node}
            licenseId={licenseId}
            licenseType={licenseType}
            owner={owner}
            totalAssignedAmount={totalAssignedAmount}
            totalClaimedAmount={totalClaimedAmount}
            isBanned={isBanned}
        />
    );
}
