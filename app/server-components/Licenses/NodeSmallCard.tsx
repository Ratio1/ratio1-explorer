import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import Link from 'next/link';

export default async function NodeSmallCard({ nodeEthAddr }: { nodeEthAddr: types.EthAddress }) {
    let nodeResponse: types.OraclesAvailabilityResult;

    try {
        nodeResponse = await getNodeLastEpoch(nodeEthAddr);
    } catch (error: any) {
        if (!error?.message?.includes('No internal node address')) {
            console.error(nodeEthAddr, error);
        }

        return null;
    }

    return (
        <Link href={`${routePath.node}/${nodeEthAddr}`} className="w-full">
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

                        <ClientWrapper>
                            <CopyableAddress value={nodeEthAddr} />
                        </ClientWrapper>
                    </div>
                </div>
            </SmallCard>
        </Link>
    );
}
