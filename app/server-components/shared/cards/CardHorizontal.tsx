import clsx from 'clsx';
import { JSX } from 'react';
import { CardFlexible } from './CardFlexible';

export const CardHorizontal = ({
    label,
    value,
    isFlexible,
    isSmall,
    isSmaller,
    isDarker,
    widthClasses,
}: {
    label: string | JSX.Element;
    value: number | string | JSX.Element;
    isFlexible?: boolean;
    isSmall?: boolean;
    isSmaller?: boolean;
    isDarker?: boolean;
    widthClasses?: string;
}) => {
    return (
        <CardFlexible isFlexible={isFlexible} isDarker={isDarker} widthClasses={widthClasses}>
            <div className="row w-full justify-between gap-4 px-4 py-4 sm:gap-6 md:gap-8 lg:px-6 lg:py-6">
                <div className="text-[15px] font-medium text-slate-500">{label}</div>
                <div
                    className={clsx('text-right font-semibold', {
                        'text-lg md:text-[19px]': !isSmall && !isSmaller,
                        'text-base md:text-[17px]': isSmall,
                        'text-[15px] sm:text-base': isSmaller,
                    })}
                >
                    {value}
                </div>
            </div>
        </CardFlexible>
    );
};
