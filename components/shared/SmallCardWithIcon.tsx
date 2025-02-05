import { FunctionComponent, JSX, PropsWithChildren } from 'react';
import { RoundedCard } from './RoundedCard';

interface Props {
    icon: JSX.Element;
    label: string;
}

export const SmallCardWithIcon: FunctionComponent<PropsWithChildren<Props>> = ({ children, icon, label }) => {
    return (
        <RoundedCard>
            <div className="col h-[52px] justify-center gap-1 pl-2.5 pr-4">
                <div className="row gap-1.5">
                    <div className="center-all rounded-full bg-blue-100 p-2 text-2xl text-primary">{icon}</div>

                    <div className="col gap-[3px]">
                        {children}
                        <div className="text-xs leading-none text-slate-500">{label}</div>
                    </div>
                </div>
            </div>
        </RoundedCard>
    );
};
