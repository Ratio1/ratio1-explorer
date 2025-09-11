import * as types from '@/typedefs/blockchain';
import ListHeader from '../shared/ListHeader';
import Oracle from './Oracle';

export default async function List({ entries }: { entries: types.OracleFees[] }) {
    return (
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader useFixedWidthSmall>
                    <div className="min-w-[130px]">Alias</div>
                    <div className="min-w-[130px]">Transaction Count</div>
                    <div className="min-w-[130px]">Total Fees ($USDC)</div>
                    <div className="min-w-[120px] text-right">Total Fees ($ETH)</div>
                </ListHeader>

                {entries.map((item, index) => (
                    <Oracle key={index} oracle={item} />
                ))}
            </div>
        </div>
    );
}
