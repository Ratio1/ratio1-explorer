import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import config from '@/config';
import { getSSURL } from '@/lib/actions';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import List from '../server-components/NodeOperators/List';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata() {
    return {
        title: 'Node Operators',
        openGraph: {
            title: 'Node Operators',
        },
    };
}

const fetchLicenseHolders = async (environment: 'mainnet' | 'testnet' | 'devnet') => {
    const url = await getSSURL(`license-holders?env=${environment}`);

    const res = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes
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
};

export default async function NodeOperatorsPage(props: {
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
        ({ ndHolders, mndHolders } = await fetchLicenseHolders(config.environment));

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
        console.log('[NodeOperatorsPage] Failed to fetch data');
        return <NotFound />;
    }

    return (
        <>
            <div className="w-full">
                <BorderedCard>
                    <div className="card-title-big font-bold">Node Operators</div>

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
                </BorderedCard>
            </div>

            <List owners={sortedHolders} currentPage={currentPage} />
        </>
    );
}

function NotFound() {
    return <ErrorComponent title="Error" description="The node operators data could not be loaded. Please try again later." />;
}
