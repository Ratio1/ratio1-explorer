import { getSSURL } from '@/lib/actions';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import List from '../server-components/Accounts/List';
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

    const holders: {
        [key: types.EthAddress]: LicenseItem[];
    } = {};

    let sortedHolders: {
        ethAddress: types.EthAddress;
        licenses: LicenseItem[];
    }[];

    try {
        ({ ndHolders, mndHolders } = await fetchCachedLicenseHolders());

        ndHolders.forEach((holder) => {
            if (!holders[holder.ethAddress]) {
                holders[holder.ethAddress] = [];
            }
            holders[holder.ethAddress].push({ licenseId: holder.licenseId, licenseType: 'ND' });
        });

        mndHolders.forEach((holder) => {
            if (!holders[holder.ethAddress]) {
                holders[holder.ethAddress] = [];
            }
            holders[holder.ethAddress].push({
                licenseId: holder.licenseId,
                licenseType: holder.licenseId === 1 ? 'GND' : 'MND',
            });
        });

        // Convert holders object to array and sort by license count (descending)
        sortedHolders = Object.entries(holders)
            .map(([ethAddress, licenses]) => ({
                ethAddress: ethAddress as types.EthAddress,
                licenses,
            }))
            .sort((a, b) => b.licenses.length - a.licenses.length);
    } catch (error) {
        console.error(error);
        console.log('[Accounts Page] Failed to fetch account data');
        notFound();
    }

    return (
        <>
            <div className="w-full">
                <CardBordered>
                    <div className="card-title-big font-bold">Accounts</div>

                    <div className="flexible-row">
                        <CardHorizontal
                            label="Holders"
                            value={
                                new Set([
                                    ...ndHolders.map((holder) => holder.ethAddress),
                                    ...mndHolders.map((holder) => holder.ethAddress),
                                ]).size
                            }
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />

                        <CardHorizontal
                            label="Holders (ND)"
                            value={new Set(ndHolders.map((holder) => holder.ethAddress)).size}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />

                        <CardHorizontal
                            label="Holders (MND)"
                            value={new Set(mndHolders.map((holder) => holder.ethAddress)).size}
                            isFlexible
                            widthClasses="min-w-[192px]"
                        />
                    </div>
                </CardBordered>
            </div>

            <List owners={sortedHolders} currentPage={currentPage} />
        </>
    );
}
