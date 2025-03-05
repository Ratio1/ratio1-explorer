import clsx from 'clsx';
import { JSX } from 'react';
import { CardFlexible } from './CardFlexible';

export const CardHorizontal = ({
    label,
    value,
    isFlexible,
    isSmall,
    isDarker,
    minWidthClass,
}: {
    label: string | JSX.Element;
    value: number | string | JSX.Element;
    isFlexible?: boolean;
    isSmall?: boolean;
    isDarker?: boolean;
    minWidthClass?: string;
}) => {
    return (
        <CardFlexible isFlexible={isFlexible} isDarker={isDarker} minWidthClass={minWidthClass}>
            <div className="row w-full justify-between gap-6 px-4 py-4 md:gap-12 lg:px-6 lg:py-6">
                <div className="text-[15px] font-medium text-slate-500">{label}</div>
                <div
                    className={clsx('font-semibold', {
                        'text-lg md:text-xl': !isSmall,
                        'text-lg': isSmall,
                    })}
                >
                    {value}
                </div>
            </div>
        </CardFlexible>
    );
};
