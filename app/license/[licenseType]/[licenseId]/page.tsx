import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { LicensePageCardHeader } from '@/app/server-components/shared/Licenses/LicensePageCardHeader';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { licenseId } = await params;

    return {
        title: `License #${licenseId} | Ratio1 Explorer`,
        openGraph: {
            title: `License #${licenseId} | Ratio1 Explorer`,
        },
    };
}

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !licenseId) {
        notFound();
    }

    let owner: types.EthAddress, license: types.License;

    try {
        owner = await getOwnerOfLicense(licenseType, licenseId);
        license = await getLicense(licenseType, licenseId);
    } catch (error) {
        console.error(error);
        notFound();
    }

    console.log({ license, owner });

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-2xl font-bold">License #{licenseId}</div>

                        <div className="flex flex-wrap items-stretch gap-3">
                            {!!licenseType && <CardHorizontal label="Type" value={licenseType} isSmall />}

                            {!!owner && (
                                <CardHorizontal
                                    label="Owner"
                                    value={
                                        <Link href={`${routePath.owner}/${owner}`}>
                                            <div className="hover:opacity-50">{owner}</div>
                                        </Link>
                                    }
                                    isSmall
                                    isFlexible
                                />
                            )}
                        </div>

                        <CardBordered>
                            <LicensePageCardHeader licenseId={licenseId} license={license} />
                        </CardBordered>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
