import { getLicense } from '@/lib/api/blockchain';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import * as types from '@/typedefs/blockchain';
import NodeListNodeCard from './NodeListNodeCard';

export default async function NodeListGNDCard() {
    const licenseId: bigint = 1n;
    const licenseType: 'ND' | 'MND' | 'GND' | undefined = 'GND';

    let owner: string, totalAssignedAmount: bigint, totalClaimedAmount: bigint, isBanned: boolean;
    let nodeAddress: types.EthAddress, ratio1Addr: types.R1Address, node: types.NodeState;

    try {
        ({ owner, nodeAddress, totalAssignedAmount, totalClaimedAmount, isBanned } = await getLicense(
            licenseType,
            Number(licenseId),
        ));

        const nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult = await getNodeLastEpoch(nodeAddress);

        ratio1Addr = nodeResponse.node as types.R1Address;

        node = {
            eth_addr: nodeResponse.node_eth_address,
            alias: nodeResponse.node_alias,
            tags: [],
            last_state: nodeResponse.node_is_online ? 'online' : 'offline',
            last_seen_ago: nodeResponse.node_last_seen_sec.toString(),
            non_zero: 0,
            overall_availability: 0,
            score: 0,
            first_check: '',
            last_check: '',
            recent_history: {
                last_10_ep: '',
                certainty: '',
                last_epoch_id: 0,
                last_epoch_nr_hb: 0,
                last_epoch_1st_hb: '',
                last_epoch_last_hb: '',
                last_epoch_avail: nodeResponse.epochs_vals[0],
            },
            ver: nodeResponse.node_version,
        };
    } catch (error: any) {
        console.log(error);
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
