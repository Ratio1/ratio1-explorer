import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicenses } from '@/lib/api/blockchain';
import { fBI, getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { ownerEthAddr } = await params;

    if (!ownerEthAddr) {
        notFound();
    }

    const ensName = await cachedGetENSName(ownerEthAddr);

    return {
        title: `Account • ${ensName || getShortAddress(ownerEthAddr, 4, true)}`,
        openGraph: {
            title: `Account • ${ensName || getShortAddress(ownerEthAddr, 4, true)}`,
        },
    };
}

const cachedGetENSName = cache(async (ownerEthAddr: string) => {
    try {
        const response = await fetch(`https://api.ensideas.com/ens/resolve/${ownerEthAddr}`);
        if (response.ok) {
            const data = await response.json();
            return data.name || null;
        }
    } catch (error) {
        console.log('Error fetching ENS name');
    }
});

export default async function OwnerPage({ params }) {
    const { ownerEthAddr } = await params;

    if (!ownerEthAddr || !isAddress(ownerEthAddr) || isEmptyETHAddr(ownerEthAddr)) {
        notFound();
    }

    let licenses: types.LicenseInfo[];

    try {
        licenses = await getLicenses(ownerEthAddr);
        console.log('[OwnerPage]', licenses);
    } catch (error) {
        console.error(error);
        notFound();
    }

    const ensName = await cachedGetENSName(ownerEthAddr);

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">
                            Account •{' '}
                            {ensName ? (
                                <span>{ensName}</span>
                            ) : (
                                <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>
                            )}
                        </div>
                    </div>

                    <div className="col gap-3">
                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardHorizontal
                                label="Address"
                                value={
                                    <div>
                                        <CopyableAddress value={ownerEthAddr} size={8} isLarge />
                                    </div>
                                }
                                isSmall
                                isFlexible
                            />

                            <CardHorizontal label="Licenses Owned" value={<div>{licenses.length}</div>} isSmall isFlexible />

                            <CardHorizontal
                                label="Total $R1 Claimed"
                                value={
                                    <div>
                                        {fBI(
                                            licenses.reduce((acc, license) => acc + license.totalClaimedAmount, 0n),
                                            18,
                                        )}
                                    </div>
                                }
                                isSmall
                                isFlexible
                            />
                        </div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
