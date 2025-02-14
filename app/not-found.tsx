import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Error',
    description:
        'The page or content you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
};

export default async function NotFound() {
    return (
        <div className="center-all m-auto min-h-full w-full gap-2 py-8">
            <div className="center-all flex-col gap-3 py-8">
                <div className="text-7xl font-semibold text-slate-700">404</div>

                <div className="center-all flex-col gap-1 text-center">
                    <div className="text-xl font-semibold">Oops, an error occured!</div>

                    <div className="max-w-[600px] text-slate-500">
                        The page or content you are looking for might have been removed, had its name changed, or is temporarily
                        unavailable.
                    </div>
                </div>
            </div>
        </div>
    );
}
