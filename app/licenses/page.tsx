import { getLicensesTotalSupply } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { LicenseItem } from '@/typedefs/general';
import { redirect } from 'next/navigation';
import List from '../server-components/Licenses/List';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata() {
    return {
        title: 'Licenses',
        openGraph: {
            title: 'Licenses',
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
        redirect(routePath.notFound);
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
