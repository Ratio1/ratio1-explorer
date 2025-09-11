import * as types from '@/typedefs/blockchain';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';

export default async function Oracle({ oracle }: { oracle: types.OracleFees }) {
    return (
        <BorderedCard useCustomWrapper useFixedWidthSmall>
            <div className="row items-start justify-between gap-3 py-2 lg:gap-6">
                <div className="w-[130px] overflow-hidden text-ellipsis whitespace-nowrap py-2 text-sm font-medium lg:text-[15px]">
                    {oracle.alias}
                </div>

                <div className="min-w-[130px]">
                    <CardItem label="Transaction Count" value={oracle.txCount} />
                </div>

                <div className="min-w-[130px]">
                    <CardItem label="Total Fees ($USDC)" value={oracle.totalFeeUSD} />
                </div>

                <div className="min-w-[120px]">
                    <CardItem
                        label="Total Fees ($ETH)"
                        value={<div className="text-left lg:text-right">{oracle.totalFeeETH}</div>}
                    />
                </div>
            </div>
        </BorderedCard>
    );
}
