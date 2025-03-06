import { getSSURL } from '@/lib/actions';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache } from 'react';
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

const fetchCachedLicenseHolders = cache(async () => {
    const url = await getSSURL('license-holders');

    const res = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const data: {
        ndHolders: {
            ethAddress: types.EthAddress;
            licenseId: number;
        }[];
        mndHolders: {
            ethAddress: types.EthAddress;
            licenseId: number;
        }[];
    } = await res.json();
    return data;
});

export default async function AccountsPage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    let ndHolders: {
            ethAddress: types.EthAddress;
            licenseId: number;
        }[],
        mndHolders: {
            ethAddress: types.EthAddress;
            licenseId: number;
        }[];

    try {
        ({ ndHolders, mndHolders } = await fetchCachedLicenseHolders());
        console.log(ndHolders, mndHolders);
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
