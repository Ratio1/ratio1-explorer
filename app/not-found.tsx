import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Error',
    description:
        'The page or content you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
};

export default async function NotFound() {
    return (
        <div className="center-all m-auto min-h-full w-full gap-2 py-8">
            <div className="center-all flex-col gap-4 py-8">
                <div className="text-6xl font-semibold text-gray-700">404</div>

                <div className="center-all flex-col gap-2 text-center">
                    <div className="text-xl font-semibold lg:text-2xl">Oops, an error occured!</div>

                    <div className="text-base font-medium lg:text-lg">
                        The page or content you are looking for might have been removed, had its name changed, or is temporarily
                        unavailable.
                    </div>
                </div>
            </div>
        </div>
    );
}
