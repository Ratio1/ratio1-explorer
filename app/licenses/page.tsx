import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import { PAGE_SIZE } from '@/config';
import { getLicensesPage } from '@/lib/api/blockchain';
import { LicenseListItem } from '@/typedefs/general';
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

const getCachedLicensesPage = unstable_cache(
    async (currentPage: number) => {
        const page = currentPage > 0 ? currentPage : 1;
        const offset = (page - 1) * PAGE_SIZE;

        return getLicensesPage(offset, PAGE_SIZE);
    },
    ['licenses-page'],
    { revalidate: 300 },
);

export default async function LicensesPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let ndTotalSupply: bigint, mndTotalSupply: bigint;
    let licensesCount: number;
    let licenses: LicenseListItem[];

    try {
        const {
            ndTotalSupply: ndSupply,
            mndTotalSupply: mndSupply,
            licenses: pageLicenses,
        } = await getCachedLicensesPage(currentPage);

        ndTotalSupply = ndSupply;
        mndTotalSupply = mndSupply;
        licenses = pageLicenses;
        licensesCount = Number(ndTotalSupply + mndTotalSupply);
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
                            value={licensesCount.toString()}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                        <CardHorizontal label="ND" value={ndTotalSupply.toString()} isFlexible widthClasses="min-w-[192px]" />
                        <CardHorizontal label="MND" value={mndTotalSupply.toString()} isFlexible widthClasses="min-w-[192px]" />
                    </div>
                </BorderedCard>
            </div>

            <List licenses={licenses} currentPage={currentPage} totalLicenses={licensesCount} />
        </>
    );
}

function NotFound() {
    return <ErrorComponent title="Error" description="The licenses data could not be loaded. Please try again later." />;
}
