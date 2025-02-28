import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<
    PropsWithChildren<{ isFlexible?: boolean; isDarker?: boolean; key?: number | string }>
> = ({ children, isDarker, isFlexible, key }) => {
    return (
        <div
            key={key}
            className={clsx('row min-w-48 rounded-xl', {
                'flex-1': isFlexible,
                'bg-slate-100': !isDarker,
                'bg-slate-200': isDarker,
            })}
        >
            {children}
        </div>
    );
};
