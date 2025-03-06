import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import Link from 'next/link';

export default async function NodeSmallCard({ nodeEthAddr }: { nodeEthAddr: types.EthAddress }) {
    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        nodeResponse = await getNodeLastEpoch(nodeEthAddr);
    } catch (error: any) {
        console.error({ nodeEthAddr }, error);
        return null;
    }

    return (
        <Link href={`${routePath.node}/${nodeEthAddr}`}>
            <SmallCard isHoverable>
                <div className="row gap-2.5">
                    <div
                        className={clsx('h-9 w-1 rounded-full', {
                            'bg-teal-500': nodeResponse.node_is_online,
                            'bg-red-500': !nodeResponse.node_is_online,
                        })}
                    ></div>

                    <div className="col font-medium">
                        <div className="max-w-[206px] overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5">
                            {nodeResponse.node_alias}
                        </div>

                        <CopyableAddress value={nodeEthAddr} />
                    </div>
                </div>
            </SmallCard>
        </Link>
    );
}
