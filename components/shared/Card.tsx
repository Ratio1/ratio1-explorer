import { FunctionComponent, PropsWithChildren } from 'react';

export const Card: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="rounded-full bg-lightBlue px-4 py-2.5">{children}</div>;
};
