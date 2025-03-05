import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<
    PropsWithChildren<{ isFlexible?: boolean; isDarker?: boolean; minWidthClasses?: string }>
> = ({ children, isDarker, isFlexible, minWidthClasses }) => {
    return (
        <div
            className={clsx(`row w-full rounded-xl md:w-auto ${minWidthClasses || ''}`, {
                'flex-1': isFlexible,
                'bg-slate-100': !isDarker,
                'bg-slate-200': isDarker,
            })}
        >
            {children}
        </div>
    );
};
