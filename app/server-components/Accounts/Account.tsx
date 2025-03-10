import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
import { SmallTag } from '../shared/SmallTag';
import AccountLincenseStats from './AccountLincenseStats';

interface Props {
    ethAddress: types.EthAddress;
    licenses: LicenseItem[];
}

export default async function Account({ ethAddress, licenses }: Props) {
    return (
        <CardBordered useCustomWrapper hasFixedWidth>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6 lg:py-4">
                <div className="min-w-[180px]">
                    <Item
                        label={
                            licenses.findIndex((license) => license.licenseType === 'GND') !== -1 ? (
                                <SmallTag>Foundation Wallet</SmallTag>
                            ) : (
                                <></>
                            )
                        }
                        value={<CopyableAddress value={ethAddress} size={4} link={`${routePath.owner}/${ethAddress}`} />}
                    />
                </div>

                <div className="flex min-w-[188px]">
                    <Item
                        label="Licenses Owned (ND / MND)"
                        value={
                            <div>
                                <span className="text-body">{licenses.length}</span> (
                                <span className="text-primary">
                                    {licenses.filter((license) => license.licenseType === 'ND').length}
                                </span>{' '}
                                /{' '}
                                <span className="text-purple-600">
                                    {licenses.filter((license) => license.licenseType !== 'ND').length}
                                </span>
                                )
                            </div>
                        }
                    />
                </div>

                <Suspense fallback={<Skeleton className="min-h-[40px] min-w-[346px] rounded-xl" />}>
                    <AccountLincenseStats ethAddress={ethAddress} />
                </Suspense>
            </div>
        </CardBordered>
    );
}
