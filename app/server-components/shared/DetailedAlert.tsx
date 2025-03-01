import clsx from 'clsx';
import { FunctionComponent, JSX, PropsWithChildren } from 'react';

interface Props {
    icon: JSX.Element;
    title: string;
    description: JSX.Element;
    largeTitle?: boolean;
}

export const DetailedAlert: FunctionComponent<PropsWithChildren<Props>> = ({
    children,
    icon,
    title,
    description,
    largeTitle = false,
}) => {
    return (
        <div className="center-all col gap-6 py-6">
            <div className="center-all rounded-full bg-red-100 p-5">
                <div className="text-3xl text-red-500">{icon}</div>
            </div>

            <div className="col gap-1 text-center">
                <div
                    className={clsx('font-bold uppercase tracking-wider text-primary-800', {
                        'text-3xl': largeTitle,
                    })}
                >
                    {title}
                </div>

                <div className="text-slate-400">{description}</div>

                {!!children && <div className="mx-auto pt-4">{children}</div>}
            </div>
        </div>
    );
};
