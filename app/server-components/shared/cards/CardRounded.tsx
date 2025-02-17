import { FunctionComponent, PropsWithChildren } from 'react';

export const CardRounded: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <div className="rounded-full bg-slate-100">{children}</div>;
};
