'use client'; // Error boundaries must be Client Components

import { Button } from '@heroui/button';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    // IMPORTANT: Rethrow redirect and notFound errors immediately before any hooks
    // These are special Next.js errors that should not be caught by error boundaries
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.digest?.startsWith('NEXT_NOT_FOUND')) {
        console.log('[Error] Redirect error detected:', error);
        throw error;
    }

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="center-all m-auto min-h-full w-full gap-2 py-8">
            <div className="center-all flex-col gap-3 py-8">
                <div className="center-all flex-col gap-2 text-center">
                    <div className="text-xl font-semibold">Oops, something went wrong!</div>

                    <div className="max-w-[600px] text-slate-500">
                        Wait a few minutes and refresh the page. If that still doesn't work, please contact the development
                        team.
                    </div>
                </div>

                <Button className="mt-2" color="primary" onPress={reset}>
                    <div className="font-medium">Refresh</div>
                </Button>
            </div>
        </div>
    );
}
