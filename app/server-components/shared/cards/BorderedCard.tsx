import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    useCustomWrapper?: boolean;
    useFixedWidthLarge?: boolean;
    useFixedWidthSmall?: boolean;
    roundedSmall?: boolean;
}

export const BorderedCard: FunctionComponent<PropsWithChildren<Props>> = ({
    children,
    useCustomWrapper = false,
    useFixedWidthLarge = false,
    useFixedWidthSmall = false,
    roundedSmall = false,
}) => {
    return (
        <div
            className={clsx('flex w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100', {
                'min-w-[1126px]': useFixedWidthLarge,
                'min-w-[820px]': useFixedWidthSmall,
                '!rounded-xl': roundedSmall,
            })}
        >
            <div
                className={clsx('w-full bg-white px-4 lg:px-6', {
                    'col gap-4 py-4 lg:gap-5 lg:py-6': !useCustomWrapper,
                })}
            >
                {children}
            </div>
        </div>
    );
};
