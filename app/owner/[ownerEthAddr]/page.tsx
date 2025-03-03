import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { getShortAddress } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { ownerEthAddr } = await params;

    if (!ownerEthAddr) {
        notFound();
    }

    return {
        title: `${getShortAddress(ownerEthAddr, 4, true)}`,
        openGraph: {
            title: `${getShortAddress(ownerEthAddr, 4, true)}`,
        },
    };
}

export default async function OwnerPage({ params }) {
    const { ownerEthAddr } = await params;

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="roboto text-[20px] font-bold">{ownerEthAddr}</div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
