import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    isHoverable?: boolean;
}

export const CardBordered: FunctionComponent<PropsWithChildren<Props>> = ({ children, isHoverable = false }) => {
    return (
        <div
            className={clsx('flex w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100', {
                'transition-all hover:border-slate-200': isHoverable,
            })}
        >
            {children}
        </div>
    );
};
