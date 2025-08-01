import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { Tag } from '@/app/server-components/shared/Tag';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import config from '@/config';
import { fetchErc20Balance, fetchEthBalance } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { fBI, fN } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import { formatDistanceToNow, subSeconds } from 'date-fns';
import { round } from 'lodash';
import Link from 'next/link';
import { RiEye2Line } from 'react-icons/ri';
import { CardTitle } from '../shared/CardTitle';

export default async function NodeCard({
    nodeResponse,
    hasLink,
}: {
    nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    hasLink?: boolean; // If it has a link to it, it means it's not the main card (displayed on top of the page)
}) {
    const getTitle = () => <CardTitle hasLink={hasLink}>Node • {nodeResponse.node_alias}</CardTitle>;

    let nodeR1Balance: bigint | undefined;
    let nodeEthBalance: bigint | undefined;

    try {
        if (nodeResponse.node_is_oracle) {
            [nodeR1Balance, nodeEthBalance] = await Promise.all([
                fetchErc20Balance(nodeResponse.node_eth_address, config.r1ContractAddress),
                fetchEthBalance(nodeResponse.node_eth_address),
            ]);
        }
    } catch (error) {
        console.error('Error fetching node balances for node:', nodeResponse.node_eth_address, error);
    }

    return (
        <BorderedCard>
            <div className="row gap-3">
                {!hasLink ? (
                    getTitle()
                ) : (
                    <Link href={`${routePath.node}/${nodeResponse.node_eth_address}`} className="hover:text-primary">
                        {getTitle()}
                    </Link>
                )}

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
                <div className="flexible-row">
                    <CardFlexible isFlexible widthClasses="sm:min-w-[410px]">
                        <div className="col w-full gap-0.5 px-4 py-4 lg:px-6 lg:py-6">
                            <div className="row justify-between gap-4 font-medium leading-none md:gap-8 lg:gap-12">
                                <div className="text-[15px] text-slate-500">
                                    <span className="web-only-block">ETH Address</span>
                                    <span className="mobile-only-block">ETH Addr.</span>
                                </div>

                                <span className="web-only-block">
                                    <ClientWrapper>
                                        <CopyableAddress value={nodeResponse.node_eth_address} size={8} isLarge />
                                    </ClientWrapper>
                                </span>
                                <span className="mobile-only-block">
                                    <ClientWrapper>
                                        <CopyableAddress value={nodeResponse.node_eth_address} size={4} />
                                    </ClientWrapper>
                                </span>
                            </div>

                            <div className="row justify-between gap-4 font-medium leading-none md:gap-8 lg:gap-12">
                                <div className="text-[15px] text-slate-500">
                                    <span className="web-only-block">Internal Address</span>
                                    <span className="mobile-only-block">Internal Addr.</span>
                                </div>

                                <span className="web-only-block">
                                    <ClientWrapper>
                                        <CopyableAddress value={nodeResponse.node as types.R1Address} size={8} isLarge />
                                    </ClientWrapper>
                                </span>
                                <span className="mobile-only-block">
                                    <ClientWrapper>
                                        <CopyableAddress value={nodeResponse.node as types.R1Address} size={4} />
                                    </ClientWrapper>
                                </span>
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
                        widthClasses="min-w-[240px]"
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
                        widthClasses="min-w-[302px] md:max-w-[340px]"
                    />

                    <CardHorizontal
                        label="Version"
                        value={nodeResponse.node_version.split('|')[0]}
                        widthClasses="min-w-[192px]"
                        isFlexible
                        isSmall
                    />

                    <CardHorizontal
                        label="CPU Cores Available"
                        value={`${round(nodeResponse.resources.cpu_cores_avail, 1)}/${round(nodeResponse.resources.cpu_cores, 1)}`}
                        isFlexible
                        widthClasses="min-w-[300px]"
                    />

                    <CardHorizontal
                        label="Memory Available"
                        value={
                            <div className="leading-tight">
                                {fN(round(nodeResponse.resources.mem_avail, 2))}/
                                {fN(round(nodeResponse.resources.mem_total, 2))} <span className="text-slate-500">GB</span>
                            </div>
                        }
                        isFlexible
                        widthClasses="min-w-[312px]"
                    />

                    <CardHorizontal
                        label="Disk Available"
                        value={
                            <div className="leading-tight">
                                {fN(round(nodeResponse.resources.disk_avail, 2))}/
                                {fN(round(nodeResponse.resources.disk_total, 2))} <span className="text-slate-500">GB</span>
                            </div>
                        }
                        isFlexible
                        widthClasses="min-w-[320px] md:max-w-[340px]"
                    />

                    {nodeResponse.node_is_oracle && nodeR1Balance !== undefined && nodeEthBalance !== undefined && (
                        <>
                            <CardHorizontal
                                label="$R1 Balance"
                                value={<div className="text-primary">{fBI(nodeR1Balance, 18)}</div>}
                                isFlexible
                                widthClasses="min-w-[300px] md:max-w-[320px]"
                            />

                            <CardHorizontal
                                label="ETH Balance"
                                value={<div className="text-primary">{fBI(nodeEthBalance, 18)}</div>}
                                isFlexible
                                widthClasses="min-w-[300px] md:max-w-[320px]"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="w-full text-right text-sm font-medium text-slate-400">
                {nodeResponse.node_version.replace(/\|(?=\S)/g, '| ')}
            </div>
        </BorderedCard>
    );
}
