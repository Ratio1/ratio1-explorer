import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getNodeToLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { EthAddress, NodeState, R1Address } from '@/typedefs/blockchain';
import Link from 'next/link';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    const { licenseId, licenseType } = await getNodeToLicense(node.eth_addr);

    const getNodeMainInfo = (ethAddr: EthAddress, ratio1Addr: R1Address) => (
        <div className="row relative min-w-[140px]">
            <div className="absolute inset-y-0 my-0.5 w-1 rounded-full bg-primary-400"></div>

            <div className="col pl-3 font-medium">
                <CopyableAddress value={ethAddr} />
                <CopyableAddress value={ratio1Addr} />
            </div>
        </div>
    );

    return (
        <Link href={`${routePath.node}/${node.eth_addr}`}>
            <CardBordered isHoverable>
                <div className="row w-full justify-between gap-6 bg-white px-6 py-3">
                    <div className="w-[228px] overflow-hidden text-ellipsis whitespace-nowrap font-medium">{node.alias}</div>

                    {getNodeMainInfo(node.eth_addr, ratio1Addr)}

                    <Item label="License ID" value={licenseId} />

                    <Item label="License Type" value={licenseType} />

                    <div className="min-w-[50px]">
                        <Item label="Version" value={<>{node.ver.split('|')[0]}</>} />
                    </div>

                    <Item
                        label="Last Epoch Availability"
                        value={<>{parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%</>}
                    />
                </div>
            </CardBordered>
        </Link>
    );
}
