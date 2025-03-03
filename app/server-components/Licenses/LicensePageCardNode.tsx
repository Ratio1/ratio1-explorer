import { SmallCard } from '@/components/Licenses/SmallCard';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import Link from 'next/link';

export default async function LicensePageCardNode({
    nodeAddress,
    nodeAlias,
    isNodeOnline,
}: {
    nodeAddress: types.EthAddress;
    nodeAlias: string;
    isNodeOnline: boolean;
}) {
    return (
        <SmallCard>
            <div className="row gap-2.5">
                <div
                    className={clsx('h-9 w-1 rounded-full', {
                        'bg-teal-500': isNodeOnline,
                        'bg-red-500': !isNodeOnline,
                    })}
                ></div>

                <div className="col text-sm font-medium">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">{nodeAlias}</div>

                    <Link href={`${routePath.node}/${nodeAddress}`} className="text-slate-400 hover:opacity-50">
                        <div className="leading-5">{getShortAddress(nodeAddress)}</div>
                    </Link>
                </div>
            </div>
        </SmallCard>
    );
}
