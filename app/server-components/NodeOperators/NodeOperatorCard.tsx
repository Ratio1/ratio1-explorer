import ClientWrapper from '@/components/shared/ClientWrapper';
import { routePath } from '@/lib/routes';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import ProfileImage from '../Profile/ProfileImage';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { SmallTag } from '../shared/SmallTag';
import AccountLincenseStats from './AccountLincenseStats';

interface Props {
    name?: string;
    ethAddress: types.EthAddress;
    licenses: LicenseItem[];
}

export default async function NodeOperatorCard({ name, ethAddress, licenses }: Props) {
    let ensName: string | undefined;
    const link = `${routePath.nodeOperator}/${ethAddress}`;

    try {
        ensName = await cachedGetENSName(ethAddress);
    } catch (error) {
        console.error(error);
    }

    const getLinkWrapper = (children: React.ReactNode) => (
        <Link href={link} className="font-medium hover:text-primary">
            {children}
        </Link>
    );

    return (
        <BorderedCard useCustomWrapper useFixedWidthSmall>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6 lg:py-4">
                <div className="min-w-[282px]">
                    <CardItem
                        label="Name"
                        value={
                            <div className="row gap-2">
                                <div className="center-all relative mr-0.5 h-[32px] w-[32px] min-w-[32px] overflow-hidden rounded-[37.5%]">
                                    <ClientWrapper>
                                        <ProfileImage ownerEthAddr={ethAddress} isSmall />
                                    </ClientWrapper>
                                </div>

                                {getLinkWrapper(
                                    name || ensName || (
                                        <div className="text-slate-400 hover:text-primary">
                                            {getShortAddress(ethAddress, 4)}
                                        </div>
                                    ),
                                )}

                                {licenses.findIndex((license) => license.licenseType === 'GND') !== -1 && (
                                    <SmallTag>Foundation Wallet</SmallTag>
                                )}
                            </div>
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
