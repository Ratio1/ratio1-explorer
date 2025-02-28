'use client';

import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const SmallCard: FunctionComponent<
    PropsWithChildren<{
        isHoverable?: boolean;
    }>
> = ({ children, isHoverable }) => (
    <div
        className={clsx(
            'flex w-full min-w-24 items-center rounded-2xl border-2 border-slate-100 px-4 py-2.5 sm:w-auto sm:justify-center',
            {
                'cursor-pointer hover:border-slate-200': isHoverable,
            },
        )}
    >
        {children}
    </div>
);
