import { FunctionComponent, JSX, PropsWithChildren } from 'react';

interface Props {
    icon: JSX.Element;
    label: string;
}

export const RowWithIcon: FunctionComponent<PropsWithChildren<Props>> = ({ children, icon, label }) => {
    return (
        <div className="row justify-between gap-3">
            <div className="row gap-2">
                <div className="center-all rounded-full bg-blue-100 p-1 text-lg text-primary">{icon}</div>
                <div className="whitespace-nowrap text-sm font-medium leading-none text-slate-500">{label}</div>
            </div>
            <div className="font-semibold leading-none text-primary">{children}</div>
        </div>
    );
};
