import config from '@/config';
import clsx from 'clsx';

export default async function ApiStatusCard() {
    let response: Response | undefined;

    try {
        response = await fetch(`${config.backendUrl}/auth/nodeData`);
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="row mx-auto gap-2 rounded-lg bg-slate-200 px-3.5 py-2.5">
            <div className="center-all">
                <div
                    className={clsx('h-2.5 w-2.5 rounded-full', {
                        'bg-green-500': response?.status === 200,
                        'bg-red-500': !response || response.status !== 200,
                    })}
                ></div>
            </div>

            <div className="text-sm font-medium text-slate-600">API Status</div>
        </div>
    );
}
