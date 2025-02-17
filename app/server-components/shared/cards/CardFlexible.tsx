import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<PropsWithChildren<{ hasFlex?: boolean }>> = ({ children, hasFlex }) => {
    return (
        <div
            className={clsx('row min-w-48 rounded-xl bg-slate-100', {
                'flex-1': hasFlex,
            })}
        >
            {children}
        </div>
    );
};
