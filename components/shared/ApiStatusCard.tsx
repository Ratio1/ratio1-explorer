'use client';

import { ping } from '@/lib/api/backend';
import { Spinner } from '@heroui/spinner';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

function ApiStatus() {
    const {
        data: pingData,
        error: pingError,
        isLoading: isPingLoading,
    } = useQuery({
        queryKey: ['ping'],
        queryFn: ping,
        retry: false,
    });

    return (
        <div className="row mx-auto gap-2 rounded-lg bg-slate-200 px-3.5 py-2.5">
            <div className="center-all">
                {isPingLoading ? (
                    <Spinner size="sm" className="scale-75" />
                ) : (
                    <div
                        className={clsx('h-2.5 w-2.5 rounded-full', {
                            'bg-green-500': !pingError,
                            'bg-red-500': pingData?.status === 'error' || !!pingError,
                        })}
                    ></div>
                )}
            </div>

            <div className="text-sm font-medium text-slate-600">API Status</div>
        </div>
    );
}

export default ApiStatus;
