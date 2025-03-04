import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    useCustomWrapper?: boolean;
}

export const CardBordered: FunctionComponent<PropsWithChildren<Props>> = ({ children, useCustomWrapper = false }) => {
    return (
        <div className="flex w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100">
            <div
                className={clsx('w-full bg-white px-4 lg:px-6', {
                    'col gap-5 py-4 lg:py-6': !useCustomWrapper,
                })}
            >
                {children}
            </div>
        </div>
    );
};
