import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const SmallTag: FunctionComponent<
    PropsWithChildren<{
        variant?: 'default' | 'banned';
    }>
> = ({ children, variant = 'default' }) => (
    <div className="flex">
        <div
            className={clsx('center-all rounded-md px-1.5 py-0.5 text-xs font-medium', {
                'bg-slate-100': variant === 'default',
                'bg-red-100 text-red-600': variant === 'banned',
            })}
        >
            {children}
        </div>
    </div>
);
