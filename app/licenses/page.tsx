import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import { getLicensesTotalSupply } from '@/lib/api/blockchain';
import { LicenseItem } from '@/typedefs/general';
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

export default async function LicensesPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let ndTotalSupply: bigint, mndTotalSupply: bigint;
    let licenses: LicenseItem[];

    try {
        ({ ndTotalSupply, mndTotalSupply } = await getLicensesTotalSupply());
        licenses = [
            ...Array.from({ length: Number(mndTotalSupply) }, (_, i) => ({
                licenseId: i + 1,
                licenseType: i === 0 ? ('GND' as const) : ('MND' as const),
            })),
            ...Array.from({ length: Number(ndTotalSupply) }, (_, i) => ({
                licenseId: i + 1,
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
                            value={Number(ndTotalSupply + mndTotalSupply)}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                        <CardHorizontal label="ND" value={Number(ndTotalSupply)} isFlexible widthClasses="min-w-[192px]" />
                        <CardHorizontal label="MND" value={Number(mndTotalSupply)} isFlexible widthClasses="min-w-[192px]" />
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
