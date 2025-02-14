import { JSX } from 'react';

export const Item = ({ label, value }: { label: string; value: JSX.Element }) => {
    return (
        <div className="col text-sm font-medium">
            <div className="leading-5">{label}</div>
            <div className="leading-5 text-slate-400">{value}</div>
        </div>
    );
};
