import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface Props {
    useFixedWidthSmall?: boolean;
}

export default async function ListHeader({ children, useFixedWidthSmall = false }: PropsWithChildren<Props>) {
    return (
        <div
            className={clsx(
                'hidden w-full items-center justify-between gap-3 rounded-xl border-2 border-slate-100 bg-slate-100 px-4 py-4 text-sm font-medium text-slate-500 lg:flex lg:gap-6 lg:px-6',
                {
                    'min-w-[1126px]': !useFixedWidthSmall,
                    'min-w-[820px]': useFixedWidthSmall,
                },
            )}
        >
            {children}
        </div>
    );
}
