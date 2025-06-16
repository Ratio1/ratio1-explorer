import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    hasLink?: boolean;
}

export const CardTitle: FunctionComponent<PropsWithChildren<Props>> = ({ children, hasLink }) => {
    return (
        <div
            className={clsx('font-bold', {
                'card-title': hasLink,
                'card-title-big': !hasLink,
            })}
        >
            {children}
        </div>
    );
};
