import LicenseContainer from '@/app/server-components/Licenses/LicenseContainer';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
    const { licenseId } = await params;

    return {
        title: `License #${licenseId}`,
        openGraph: {
            title: `License #${licenseId}`,
        },
    };
}

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        notFound();
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        notFound();
    }

    let owner: types.EthAddress, license: types.License;

    try {
        [owner, license] = await Promise.all([getOwnerOfLicense(licenseType, licenseId), getLicense(licenseType, licenseId)]);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-2xl font-bold">License #{licenseId}</div>

                        <div className="col gap-3">
                            {/* Row 1 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                {!!licenseType && <CardHorizontal label="Type" value={licenseType} isSmall />}

                                {!!owner && (
                                    <CardHorizontal
                                        label="Owner"
                                        value={
                                            <Link href={`${routePath.owner}/${owner}`}>
                                                <div className="hover:opacity-50">{getShortAddress(owner)}</div>
                                            </Link>
                                        }
                                        isSmall
                                    />
                                )}

                                {!!license.assignTimestamp && (
                                    <CardHorizontal
                                        label="Assign timestamp"
                                        value={new Date(Number(license.assignTimestamp) * 1000).toLocaleString()}
                                        isSmall
                                        isFlexible
                                    />
                                )}
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                {!!license.lastClaimEpoch && (
                                    <CardHorizontal
                                        label="Last claimed epoch"
                                        value={license.lastClaimEpoch.toString()}
                                        isSmall
                                    />
                                )}
                            </div>
                        </div>

                        <Suspense>
                            <LicenseContainer
                                licenseId={licenseId}
                                licenseType={licenseType as 'ND' | 'MND' | 'GND'}
                                license={license}
                            />
                        </Suspense>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
