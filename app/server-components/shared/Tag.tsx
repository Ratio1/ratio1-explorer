import { FunctionComponent, PropsWithChildren } from 'react';

export const Tag: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <div className="rounded-full bg-primary-50 px-2 py-0.5 text-xs leading-tight text-primary">
        {children}
    </div>
);
