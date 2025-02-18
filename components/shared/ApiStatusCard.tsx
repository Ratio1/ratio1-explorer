'use client';

import { ApiContextType, useApiContext } from '@/lib/contexts/apiContext';
import { Spinner } from '@heroui/spinner';
import clsx from 'clsx';

function ApiStatus() {
    const { pingData, pingError, isPingLoading } = useApiContext() as ApiContextType;

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
