import { Tag } from '@/app/server-components/shared/Tag';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import Identicon from '@/components/shared/Identicon';
import { routePath } from '@/lib/routes';
import { fN, processNodeTag } from '@/lib/utils';
import { SearchResult } from '@/typedefs/general';
import clsx from 'clsx';
import round from 'lodash/round';
import Link from 'next/link';

interface Props {
    results: SearchResult[];
    variant: 'search-page' | 'modal';
    getSectionTitle: (value: string) => React.ReactNode;
    onClose?: () => void;
}

export default function SearchResultsList({ results, variant, getSectionTitle, onClose }: Props) {
    const linkClassName = clsx('row  cursor-pointer px-4  transition-all ', {
        'rounded-xl border-2 border-slate-100 hover:border-slate-200 py-3': variant === 'search-page',
        '-mx-4 py-2.5 hover:bg-slate-50': variant === 'modal',
    });
    const nodeAddressLabelClassName = 'w-14 text-xs font-semibold uppercase tracking-normal text-slate-400';

    return (
        <div className="col gap-4">
            {results.some((r) => r.type === 'node') && (
                <div
                    className={clsx('col', {
                        'gap-1.5': variant === 'search-page',
                        'gap-2': variant === 'modal',
                    })}
                >
                    {getSectionTitle('Nodes')}

                    {results
                        .filter((r): r is Extract<SearchResult, { type: 'node' }> => r.type === 'node')
                        .map((node, index) => {
                            // Sorted so every card shows the tags in the same order (the oracle emits them unordered)
                            const nodeTags = [...(node.tags ?? [])].sort();
                            // Resources are last-heartbeat values, meaningful only while the node is online
                            const nodeResources = node.isOnline ? node.resources : undefined;

                            return (
                                <div key={index}>
                                    <Link
                                        href={`${routePath.node}/${node.nodeAddress}`}
                                        className={linkClassName}
                                        onClick={onClose}
                                    >
                                        <div className="row w-full gap-3">
                                            <div className="relative h-8 w-8">
                                                <Identicon value={`node_${node.nodeAddress}`} />

                                                <div
                                                    className={clsx(
                                                        'absolute right-0 top-0 z-10 -mr-1 -mt-1 h-4 w-4 rounded-full border-2 border-white',
                                                        {
                                                            'bg-teal-500': node?.isOnline,
                                                            'bg-red-500': !node?.isOnline,
                                                        },
                                                    )}
                                                ></div>
                                            </div>

                                            <div className="col min-w-0 flex-1">
                                                <div className="text-sm font-medium">{node.alias}</div>
                                                <div className="col gap-0.5">
                                                    <div className="row flex-wrap gap-2">
                                                        <div className={nodeAddressLabelClassName}>ETH</div>
                                                        <CopyableAddress value={node.nodeAddress} size={8} />

                                                        {!!nodeTags.length && (
                                                            <div className="row ml-auto flex-wrap gap-1">
                                                                {nodeTags.map((tag) => (
                                                                    <Tag key={tag}>{processNodeTag(tag)}</Tag>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {(!!node.internalAddress || !!nodeResources) && (
                                                        <div className="row flex-wrap gap-2">
                                                            {!!node.internalAddress && (
                                                                <>
                                                                    <div className={nodeAddressLabelClassName}>Internal</div>
                                                                    <CopyableAddress value={node.internalAddress} size={8} />
                                                                </>
                                                            )}

                                                            {!!nodeResources && (
                                                                <div className="row ml-auto flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                                                                    <div className="whitespace-nowrap">
                                                                        Avail CPU:{' '}
                                                                        <span className="font-medium text-slate-700">
                                                                            {round(nodeResources.cpu_cores_avail, 1)}/
                                                                            {round(nodeResources.cpu_cores, 1)}
                                                                        </span>
                                                                    </div>

                                                                    <div className="whitespace-nowrap">
                                                                        Avail RAM:{' '}
                                                                        <span className="font-medium text-slate-700">
                                                                            {fN(round(nodeResources.mem_avail, 2))}/
                                                                            {fN(round(nodeResources.mem_total, 2))}
                                                                        </span>{' '}
                                                                        GB
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            )}

            {results.some((r) => r.type === 'license') && (
                <div
                    className={clsx('col', {
                        'gap-1.5': variant === 'search-page',
                        'gap-2': variant === 'modal',
                    })}
                >
                    {getSectionTitle('Licenses')}

                    {results
                        .filter((r): r is Extract<SearchResult, { type: 'license' }> => r.type === 'license')
                        .map((license, index) => (
                            <div key={index}>
                                <Link
                                    href={`${routePath.license}/${license.licenseType}/${license.licenseId}`}
                                    className={linkClassName}
                                    onClick={onClose}
                                >
                                    <div className="row gap-3">
                                        <div className="relative h-8 w-8">
                                            <Identicon value={`${license.licenseType}${license.licenseId}`} />
                                        </div>

                                        <div className="col">
                                            <div className="row gap-1.5">
                                                <div className="text-sm font-medium">License #{license.licenseId}</div>

                                                <div className="text-sm">•</div>

                                                <div className="center-all rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
                                                    {license.licenseType}
                                                </div>
                                            </div>

                                            <CopyableAddress value={license.nodeAddress} size={8} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            )}

            {results.some((r) => r.type === 'owner') && (
                <div
                    className={clsx('col', {
                        'gap-1.5': variant === 'search-page',
                        'gap-2': variant === 'modal',
                    })}
                >
                    {getSectionTitle('Node Operators')}

                    {results
                        .filter((r): r is Extract<SearchResult, { type: 'owner' }> => r.type === 'owner')
                        .map((owner, index) => (
                            <div key={index}>
                                <Link
                                    href={`${routePath.account}/${owner.address}`}
                                    className={linkClassName}
                                    onClick={onClose}
                                >
                                    <div className="row gap-3">
                                        <div className="relative h-8 w-8">
                                            <Identicon value={`owner_${owner.address}`} />
                                        </div>

                                        <div className="col">
                                            {!!owner.ensName && <div className="text-sm font-medium">{owner.ensName}</div>}

                                            <CopyableAddress value={owner.address} size={8} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
