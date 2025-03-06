import { JSX } from 'react';

export const Item = ({ label, value }: { label: JSX.Element | string; value: JSX.Element | string | bigint | number }) => {
    return (
        <div className="col text-sm font-medium">
            <div className="leading-5">{label}</div>
            <div className="leading-5 text-slate-400">{value}</div>
        </div>
    );
};
