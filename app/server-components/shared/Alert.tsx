import clsx from 'clsx';
import { FunctionComponent, JSX } from 'react';

interface Props {
    variant?: 'primary' | 'warning';
    icon: JSX.Element;
    title: string;
    description: string;
}

export const Alert: FunctionComponent<Props> = ({ variant = 'primary', icon, title, description }) => {
    return (
        <div
            className={clsx('col gap-0.5 rounded-xl px-4 py-3', {
                'bg-primary-50': variant === 'primary',
                'bg-warning-50': variant === 'warning',
            })}
        >
            <div className="row">
                <div
                    className={clsx('center-all w-[18px]', {
                        'text-primary': variant === 'primary',
                        'text-warning': variant === 'warning',
                    })}
                >
                    {icon}
                </div>
                <div className="pl-1.5 font-medium">{title}</div>
            </div>

            <div className="ml-[18px] pl-1.5 text-sm text-gray-800">{description}</div>
        </div>
    );
};
