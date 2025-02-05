import { FunctionComponent, PropsWithChildren } from 'react';

export const RoundedCard: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="rounded-full bg-lightBlue">{children}</div>;
};
