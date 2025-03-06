import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
import AccountLincenseStats from './AccountLincenseStats';

interface Props {
    ethAddress: types.EthAddress;
    licenses: LicenseItem[];
}

export default async function Account({ ethAddress, licenses }: Props) {
    return (
        <CardBordered useCustomWrapper hasFixedWidth>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                <Item
                    label="Owner"
                    value={<CopyableAddress value={ethAddress} size={4} link={`${routePath.owner}/${ethAddress}`} />}
                />

                <Item label="Licenses Owned" value={<div>{licenses.length}</div>} />

                <Item
                    label="Licenses Owned (ND)"
                    value={
                        <div className="text-primary">{licenses.filter((license) => license.licenseType === 'ND').length}</div>
                    }
                />

                <Item
                    label="Licenses Owned (MND)"
                    value={
                        <div className="text-purple-600">
                            {licenses.filter((license) => license.licenseType !== 'ND').length}
                        </div>
                    }
                />

                <Suspense fallback={<Skeleton className="min-h-[40px] min-w-[346px] rounded-xl" />}>
                    <AccountLincenseStats ethAddress={ethAddress} />
                </Suspense>
            </div>
        </CardBordered>
    );
}
