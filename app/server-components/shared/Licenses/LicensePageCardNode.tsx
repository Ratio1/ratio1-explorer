import { SmallCard } from '@/components/Licenses/SmallCard';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import Link from 'next/link';

export default async function LicensePageCardNode({ nodeAddress }: { nodeAddress: types.EthAddress }) {
    let alias: string | undefined, isOnline: boolean | undefined;

    try {
        ({ node_alias: alias, node_is_online: isOnline } = await getNodeLastEpoch(nodeAddress));
    } catch (error) {
        console.error(error);
    }

    return (
        <SmallCard>
            <div className="row gap-2.5">
                <div
                    className={clsx('h-9 w-1 rounded-full', {
                        'bg-teal-500': isOnline,
                        'bg-red-500': !isOnline,
                    })}
                ></div>

                <div className="col text-sm font-medium">
                    <div className="max-w-[176px] overflow-hidden text-ellipsis whitespace-nowrap">{alias}</div>

                    <Link href={`${routePath.node}/${nodeAddress}`} className="text-slate-400 hover:opacity-50">
                        <div className="leading-5">{getShortAddress(nodeAddress)}</div>
                    </Link>
                </div>
            </div>
        </SmallCard>
    );
}
