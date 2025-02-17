import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<PropsWithChildren<{ isFlexible?: boolean }>> = ({ children, isFlexible }) => {
    return (
        <div
            className={clsx('row min-w-48 rounded-xl bg-slate-100', {
                'flex-1': isFlexible,
            })}
        >
            {children}
        </div>
    );
};
