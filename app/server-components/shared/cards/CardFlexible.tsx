import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<
    PropsWithChildren<{ isFlexible?: boolean; isDarker?: boolean; minWidthClass?: string }>
> = ({ children, isDarker, isFlexible, minWidthClass }) => {
    return (
        <div
            className={clsx(`row w-full rounded-xl lg:w-auto ${minWidthClass}`, {
                'flex-1': isFlexible,
                'bg-slate-100': !isDarker,
                'bg-slate-200': isDarker,
            })}
        >
            {children}
        </div>
    );
};
