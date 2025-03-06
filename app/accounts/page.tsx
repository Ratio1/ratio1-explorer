import { getERC20TokenTotalSupply } from '@/lib/api/blockchain';
import { notFound } from 'next/navigation';
import { CardBordered } from '../server-components/shared/cards/CardBordered';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata() {
    return {
        title: 'Accounts',
        openGraph: {
            title: 'Accounts',
        },
    };
}

export default async function AccountsPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let ndHolders: any, mndHolders: any;

    try {
        // [ndHolders, mndHolders] = await Promise.all([getLicenseHolders('ND'), getLicenseHolders('MND')]);
        // console.log({ ndHolders, mndHolders });

        const supply = await getERC20TokenTotalSupply();
        console.log({ supply });
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <>
            <div className="w-full">
                <CardBordered>
                    <div className="card-title-big font-bold">Accounts</div>

                    <div className="flexible-row">
                        <CardHorizontal label="Holders (ND)" value={Number(99)} isFlexible widthClasses="min-w-[192px]" />
                        <CardHorizontal label="Holders (MND)" value={Number(99)} isFlexible widthClasses="min-w-[192px]" />
                    </div>
                </CardBordered>
            </div>
        </>
    );
}
