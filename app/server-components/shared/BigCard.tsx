import { FunctionComponent, JSX, PropsWithChildren } from 'react';

interface Props {
    label: JSX.Element;
}

export const BigCard: FunctionComponent<PropsWithChildren<Props>> = ({ children, label }) => {
    return (
        <div className="col gap-4 rounded-3xl bg-slate-100 px-8 py-6">
            {label}

            <div className="col gap-4 rounded-2xl border border-[#e3e4e8] bg-light px-6 py-5">{children}</div>
        </div>
    );
};
