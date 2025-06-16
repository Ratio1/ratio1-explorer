import { treasuryWallets } from '@/config';
import { getServerConfig } from '@/config/serverConfig';
import { fetchErc20Balance } from '@/lib/api/blockchain';
import { fBI, fN } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import ListHeader from '../shared/ListHeader';

interface Props {
    license: types.License;
}

export default async function TreasuryDistribution({ license }: Props) {
    const { config } = await getServerConfig();

    const fetchR1TransferredOutAmount = async (walletAddress: string) => {
        try {
            const res = await fetch(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'alchemy_getAssetTransfers',
                    params: [
                        {
                            fromBlock: '0x0',
                            toBlock: 'latest',
                            fromAddress: walletAddress,
                            contractAddresses: [config.r1ContractAddress],
                            category: ['erc20'],
                        },
                    ],
                }),
            });

            const data = await res.json();

            if (!data.result?.transfers) {
                console.error(`No transfer data for ${walletAddress}:`, data);
                return 0;
            }

            const totalAmount: number = data.result.transfers.reduce((acc: number, transfer) => acc + transfer.value, 0);
            return totalAmount;
        } catch (error) {
            console.error(`Error fetching transfers for ${walletAddress}:`, error);
            return 0;
        }
    };

    const balances: {
        balance: bigint;
        transferredOut: number;
        address: types.EthAddress;
        name: string;
        percentage: number;
    }[] = await Promise.all(
        treasuryWallets.map(async (wallet) => {
            try {
                const [balance, transferredOut] = await Promise.all([
                    fetchErc20Balance(wallet.address, config.r1ContractAddress),
                    fetchR1TransferredOutAmount(wallet.address),
                ]);
                return { ...wallet, balance, transferredOut };
            } catch (error) {
                console.error(`Error fetching data for ${wallet.name}:`, error);
                return { ...wallet, balance: 0n, transferredOut: 0 };
            }
        }),
    );

    return (
        <>
            <div className="card-title font-bold">Treasury Distribution</div>

            <div className="list">
                <ListHeader useFixedWidthSmall>
                    <div className="min-w-[70px]">Wallet</div>
                    <div className="min-w-[112px]">% of GND</div>
                    <div className="min-w-[210px]">Mined/To be mined</div>
                    <div className="min-w-[120px]">$R1 Balance</div>
                    <div className="min-w-[120px]">Transferred Out</div>
                </ListHeader>

                <div className="col gap-1.5">
                    {balances
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((wallet) => (
                            <div key={wallet.address}>
                                <BorderedCard useCustomWrapper roundedSmall useFixedWidthSmall>
                                    <div className="row justify-between gap-3 py-3 lg:gap-6">
                                        <div className="min-w-[70px]">
                                            <CardItem
                                                label="Wallet"
                                                value={<div className="text-slate-500">{wallet.name}</div>}
                                            />
                                        </div>

                                        <div className="min-w-[112px]">
                                            <CardItem
                                                label="% of GND"
                                                value={
                                                    <div className="font-medium">
                                                        <span className="text-slate-500">{wallet.percentage}%</span> (
                                                        {fBI(
                                                            (license.totalAssignedAmount *
                                                                BigInt(Math.round(wallet.percentage * 100))) /
                                                                10000n,
                                                            18,
                                                        )}
                                                        )
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className="min-w-[210px]">
                                            <CardItem
                                                label="Mined/To be mined"
                                                value={
                                                    <div>
                                                        {fBI(
                                                            (license.totalClaimedAmount *
                                                                BigInt(Math.round(wallet.percentage * 100))) /
                                                                10000n,
                                                            18,
                                                        )}
                                                        /
                                                        {fBI(
                                                            ((license.totalAssignedAmount - license.totalClaimedAmount) *
                                                                BigInt(Math.round(wallet.percentage * 100))) /
                                                                10000n,
                                                            18,
                                                        )}
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className="min-w-[120px]">
                                            <CardItem
                                                label="$R1 Balance"
                                                value={
                                                    <div className="font-medium text-primary">{fBI(wallet.balance, 18)}</div>
                                                }
                                            />
                                        </div>

                                        <div className="min-w-[120px]">
                                            <CardItem
                                                label="Transferred Out"
                                                value={
                                                    wallet.transferredOut ? (
                                                        <div className="text-orange-600">{fN(wallet.transferredOut)}</div>
                                                    ) : (
                                                        <>—</>
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </BorderedCard>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
