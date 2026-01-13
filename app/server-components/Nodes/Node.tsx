import { cachedGetNodeLicenseDetails } from '@/lib/api/cache';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import NodeListNodeCard from './NodeListNodeCard';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    let licenseId: string,
        licenseType: 'ND' | 'MND' | 'GND' | undefined,
        owner: string,
        totalAssignedAmount: string,
        totalClaimedAmount: string,
        isBanned: boolean;

    try {
        ({ licenseId, licenseType, owner, totalAssignedAmount, totalClaimedAmount, isBanned } =
            await cachedGetNodeLicenseDetails(node.eth_addr));

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
            licenseId={BigInt(licenseId)}
            licenseType={licenseType}
            owner={owner}
            totalAssignedAmount={BigInt(totalAssignedAmount)}
            totalClaimedAmount={BigInt(totalClaimedAmount)}
            isBanned={isBanned}
        />
    );
}
