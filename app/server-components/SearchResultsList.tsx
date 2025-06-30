import { CopyableAddress } from '@/components/shared/CopyableValue';
import Identicon from '@/components/shared/Identicon';
import { routePath } from '@/lib/routes';
import { SearchResult } from '@/typedefs/general';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
    results: SearchResult[];
    variant: 'search-page' | 'modal';
    getSectionTitle: (value: string) => React.ReactNode;
}

export default function SearchResultsList({ results, variant, getSectionTitle }: Props) {
    const linkClassName = clsx('row  cursor-pointer px-4  transition-all ', {
        'rounded-xl border-2 border-slate-100 hover:border-slate-200 py-3': variant === 'search-page',
        '-mx-4 py-2.5 hover:bg-slate-50': variant === 'modal',
    });

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
                        .map((node, index) => (
                            <div key={index}>
                                <Link href={`${routePath.node}/${node.nodeAddress}`} className={linkClassName}>
                                    <div className="row gap-3">
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

                                        <div className="col">
                                            <div className="text-sm font-medium">{node.alias}</div>
                                            <CopyableAddress value={node.nodeAddress} size={8} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
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
                    {getSectionTitle('Accounts')}

                    {results
                        .filter((r): r is Extract<SearchResult, { type: 'owner' }> => r.type === 'owner')
                        .map((owner, index) => (
                            <div key={index}>
                                <Link href={`${routePath.owner}/${owner.address}`} className={linkClassName}>
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
