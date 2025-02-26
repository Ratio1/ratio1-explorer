import { FunctionComponent, PropsWithChildren } from 'react';

export const Tag: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <div className="flex">
        <div className="rounded-full bg-primary-50 px-2.5 py-1.5 text-primary">{children}</div>
    </div>
);
