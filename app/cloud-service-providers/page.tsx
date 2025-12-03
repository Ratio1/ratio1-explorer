import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import { fetchCSPs } from '@/lib/api/blockchain';
import { fBI } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import CSPsList from '../server-components/CPSs/CSPsList';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata() {
    return {
        title: 'Cloud Service Providers',
        openGraph: {
            title: 'Cloud Service Providers',
        },
    };
}

export default async function CSPsPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let csps: readonly types.CSP[];

    try {
        csps = await fetchCSPs();

        console.log(csps);
    } catch (error) {
        console.error(error);
        console.log('[CSPsPage] Failed to fetch data');
        return <NotFound />;
    }

    return (
        <>
            <div className="w-full">
                <BorderedCard>
                    <div className="card-title-big font-bold">Cloud Service Providers</div>

                    <div className="flexible-row">
                        <CardHorizontal label="Total CSPs" value={csps.length} isFlexible widthClasses="min-w-[192px]" />
                        <CardHorizontal
                            label="Total Value Locked"
                            value={
                                <div>
                                    <span>
                                        {fBI(
                                            csps.reduce((acc, curr) => acc + curr.tvl, 0n),
                                            6,
                                        )}
                                    </span>{' '}
                                    <span className="text-slate-500">$USDC</span>
                                </div>
                            }
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                        <CardHorizontal
                            label="Total Active Jobs"
                            value={csps.reduce((acc, curr) => acc + curr.activeJobsCount, 0)}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                    </div>
                </BorderedCard>
            </div>

            <CSPsList csps={csps} currentPage={currentPage} />
        </>
    );
}

function NotFound() {
    return (
        <ErrorComponent
            title="Error"
            description="The cloud service providers data could not be loaded. Please try again later."
        />
    );
}
