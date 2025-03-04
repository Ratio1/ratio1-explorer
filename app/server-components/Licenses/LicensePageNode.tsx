import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { Tag } from '@/app/server-components/shared/Tag';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import { formatDistanceToNow, subSeconds } from 'date-fns';
import Link from 'next/link';
import { RiEye2Line } from 'react-icons/ri';

export default async function LicensePageNode({
    cachedGetNodeAvailability,
}: {
    cachedGetNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
        await cachedGetNodeAvailability();

    if (!nodeResponse) {
        return null;
    }

    return (
        <CardBordered>
            <div className="col w-full gap-5 bg-white px-6 py-6">
                <div className="col w-full gap-5">
                    <div className="row gap-3">
                        <Link href={`${routePath.node}/${nodeResponse.node_eth_address}`} className="hover:text-primary">
                            <div className="text-2xl font-bold">Node • {nodeResponse.node_alias}</div>
                        </Link>

                        {nodeResponse.node_is_oracle && (
                            <Tag>
                                <div className="row gap-1">
                                    <RiEye2Line className="text-lg" />
                                    <div className="text-[15px] font-medium">Oracle</div>
                                </div>
                            </Tag>
                        )}
                    </div>

                    <div className="col gap-3">
                        {/* Row 1 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardFlexible isFlexible>
                                <div className="col w-full gap-0.5 px-6 py-6">
                                    <div className="row justify-between gap-12 font-medium leading-none">
                                        <div className="text-[15px] text-slate-500">ETH Address</div>
                                        <CopyableAddress value={nodeResponse.node_eth_address} size={8} isLarge />
                                    </div>

                                    <div className="row justify-between gap-12 font-medium leading-none">
                                        <div className="text-[15px] text-slate-500">Internal Address</div>
                                        <CopyableAddress value={nodeResponse.node as types.R1Address} size={8} isLarge />
                                    </div>
                                </div>
                            </CardFlexible>

                            <CardHorizontal
                                label="Status"
                                value={
                                    <div className="row gap-1.5">
                                        <div
                                            className={clsx('h-3 w-3 rounded-full', {
                                                'bg-teal-500': nodeResponse.node_is_online,
                                                'bg-red-500': !nodeResponse.node_is_online,
                                            })}
                                        ></div>

                                        <div>{nodeResponse.node_is_online ? 'Online' : 'Offline'}</div>
                                    </div>
                                }
                                isSmall
                            />

                            <CardHorizontal
                                label="Last Seen"
                                value={
                                    <div>
                                        {formatDistanceToNow(subSeconds(new Date(), nodeResponse.node_last_seen_sec), {
                                            addSuffix: true,
                                        })}
                                    </div>
                                }
                                isSmall
                                isFlexible
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardHorizontal label="Version" value={nodeResponse.node_version.split('|')[0]} isSmall />
                        </div>
                    </div>
                </div>

                <div className="w-full text-right text-sm font-medium text-slate-400">
                    {nodeResponse.node_version.replace(/\|(?=\S)/g, '| ')}
                </div>
            </div>
        </CardBordered>
    );
}
