import clsx from 'clsx';
import { JSX } from 'react';
import { CardFlexible } from './CardFlexible';

export const CardHorizontal = ({
    label,
    value,
    isFlexible,
    isSmall,
}: {
    label: string | JSX.Element;
    value: number | string | JSX.Element;
    isFlexible?: boolean;
    isSmall?: boolean;
}) => {
    return (
        <CardFlexible isFlexible={isFlexible}>
            <div className="row w-full justify-between gap-12 px-6 py-6">
                <div className="text-[15px] font-medium text-slate-500">{label}</div>
                <div
                    className={clsx('font-semibold', {
                        'text-2xl': !isSmall,
                        'text-xl': isSmall,
                    })}
                >
                    {value}
                </div>
            </div>
        </CardFlexible>
    );
};
