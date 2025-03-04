import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    variant: 'ND' | 'MND' | 'GND' | 'banned';
}

export const LargeTag: FunctionComponent<PropsWithChildren<Props>> = ({ children, variant }) => (
    <div className="flex">
        <div
            className={clsx('center-all rounded-md px-2 text-lg font-semibold', {
                'bg-primary-50 text-primary': variant === 'ND',
                'bg-purple-100 text-purple-600': variant === 'MND',
                'bg-orange-100 text-orange-600': variant === 'GND',
                'bg-red-100 text-red-600': variant === 'banned',
            })}
        >
            {children}
        </div>
    </div>
);
