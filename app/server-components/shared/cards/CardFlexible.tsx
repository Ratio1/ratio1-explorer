import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CardFlexible: FunctionComponent<
    PropsWithChildren<{ isFlexible?: boolean; isDarker?: boolean; widthClasses?: string }>
> = ({ children, isDarker, isFlexible, widthClasses }) => {
    return (
        <div
            className={clsx(`row w-full rounded-xl md:w-auto ${widthClasses || ''}`, {
                'flex-1': isFlexible,
                'bg-slate-100': !isDarker,
                'bg-slate-200': isDarker,
            })}
        >
            {children}
        </div>
    );
};
