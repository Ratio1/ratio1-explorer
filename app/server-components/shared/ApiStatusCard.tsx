import { pingBackend } from '@/lib/api';
import clsx from 'clsx';

export default async function ApiStatusCard() {
    const isApiWorking: boolean = await pingBackend();

    return (
        <div className="row mx-auto gap-2 rounded-lg bg-slate-200 px-3.5 py-2.5">
            <div className="center-all">
                <div
                    className={clsx('h-2.5 w-2.5 rounded-full', {
                        'bg-green-500': isApiWorking,
                        'bg-red-500': !isApiWorking,
                    })}
                ></div>
            </div>

            <div className="text-sm font-medium text-slate-600">API Status</div>
        </div>
    );
}
