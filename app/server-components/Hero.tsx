import { EpochTimer } from '@/components/Hero/EpochTimer';
import { R1MintedLastEpoch } from '@/components/Hero/R1MintedLastEpoch';
import { R1TotalSupply } from '@/components/Hero/R1TotalSupply';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { RiTimeLine } from 'react-icons/ri';
import { CardBordered } from './shared/cards/CardBordered';
import { CardHorizontal } from './shared/cards/CardHorizontal';

export default async function Hero() {
    let activeNodes: types.OraclesDefaultResult;

    try {
        activeNodes = await getActiveNodes();
    } catch (error) {
        return null;
    }

    return (
        <div className="w-full">
            <CardBordered>
                <div className="w-full bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Nodes</div>

                        <div className="col gap-3">
                            <div className="row flex-wrap gap-3">
                                <CardHorizontal label="Active Nodes" value={activeNodes.result.nodes_total_items} isFlexible />

                                <CardHorizontal
                                    label={
                                        <div className="row gap-1.5">
                                            <RiTimeLine className="text-lg" />
                                            <div>Epoch {activeNodes.result.server_current_epoch} ends in</div>
                                        </div>
                                    }
                                    value={<EpochTimer />}
                                />

                                <CardHorizontal
                                    label={
                                        <div>
                                            <span className="text-primary">$R1</span> total supply
                                        </div>
                                    }
                                    value={<R1TotalSupply />}
                                />

                                <CardHorizontal
                                    label={
                                        <div>
                                            <span className="text-primary">$R1</span> minted last epoch
                                        </div>
                                    }
                                    value={<R1MintedLastEpoch />}
                                />
                            </div>

                            <div className="row flex-wrap gap-3"></div>
                        </div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
