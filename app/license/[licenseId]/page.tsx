import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { licenseId } = await params;

    if (!licenseId) {
        notFound();
    }

    return {
        title: `License #${licenseId} | Ratio1 Explorer`,
        openGraph: {
            title: `License #${licenseId} | Ratio1 Explorer`,
        },
    };
}

export default async function LicensePage({ params }) {
    const { licenseId } = await params;

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">License #{licenseId}</div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
