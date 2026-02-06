import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import { getAllLicenseTokenIds } from '@/lib/api/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { unstable_cache } from 'next/cache';
import List from '../server-components/Licenses/List';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const pageParam = Number.parseInt(resolvedSearchParams?.page ?? '', 10);
    const canonical = Number.isFinite(pageParam) && pageParam > 1 ? `/licenses?page=${pageParam}` : '/licenses';

    return {
        title: 'Licenses',
        openGraph: {
            title: 'Licenses',
        },
        alternates: {
            canonical,
        },
    };
}

const getCachedLicenseTokenIds = unstable_cache(getAllLicenseTokenIds, ['licenses-token-ids'], { revalidate: 300 });

export default async function LicensesPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let ndTotalSupply: number, mndTotalSupply: number;
    let licenses: LicenseItem[];

    try {
        const { ndLicenseIds, mndLicenseIds } = await getCachedLicenseTokenIds();
        ndTotalSupply = ndLicenseIds.length;
        mndTotalSupply = mndLicenseIds.length;

        licenses = [
            ...mndLicenseIds.map((licenseId) => ({
                licenseId,
                licenseType: licenseId === 1 ? ('GND' as const) : ('MND' as const),
            })),
            ...ndLicenseIds.map((licenseId) => ({
                licenseId,
                licenseType: 'ND' as const,
            })),
        ];
    } catch (error) {
        console.error(error);
        console.log('[Licenses Page] Failed to fetch license data');
        return <NotFound />;
    }

    return (
        <>
            <div className="w-full">
                <BorderedCard>
                    <div className="card-title-big font-bold">Licenses</div>

                    <div className="flexible-row">
                        <CardHorizontal
                            label="Total"
                            value={ndTotalSupply + mndTotalSupply}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                        <CardHorizontal label="ND" value={ndTotalSupply} isFlexible widthClasses="min-w-[192px]" />
                        <CardHorizontal label="MND" value={mndTotalSupply} isFlexible widthClasses="min-w-[192px]" />
                    </div>
                </BorderedCard>
            </div>

            <List licenses={licenses} currentPage={currentPage} />
        </>
    );
}

function NotFound() {
    return <ErrorComponent title="Error" description="The licenses data could not be loaded. Please try again later." />;
}
