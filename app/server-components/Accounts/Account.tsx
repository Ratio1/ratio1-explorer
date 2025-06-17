import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { SmallTag } from '../shared/SmallTag';
import AccountLincenseStats from './AccountLincenseStats';

interface Props {
    ethAddress: types.EthAddress;
    licenses: LicenseItem[];
}

export default async function Account({ ethAddress, licenses }: Props) {
    return (
        <BorderedCard useCustomWrapper useFixedWidthLarge>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6 lg:py-4">
                <div className="min-w-[180px]">
                    <CardItem
                        label={
                            licenses.findIndex((license) => license.licenseType === 'GND') !== -1 ? (
                                <SmallTag>Foundation Wallet</SmallTag>
                            ) : (
                                <></>
                            )
                        }
                        value={
                            <ClientWrapper>
                                <CopyableAddress value={ethAddress} size={4} link={`${routePath.owner}/${ethAddress}`} />
                            </ClientWrapper>
                        }
                    />
                </div>

                <div className="flex min-w-[188px]">
                    <CardItem
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

                <Suspense fallback={<Skeleton className="min-h-[40px] min-w-[396px] rounded-xl lg:min-h-[20px]" />}>
                    <AccountLincenseStats ethAddress={ethAddress} />
                </Suspense>
            </div>
        </BorderedCard>
    );
}
