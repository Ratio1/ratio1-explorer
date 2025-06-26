import config, { treasuryWallets } from '@/config';
import { fetchErc20Balance } from '@/lib/api/blockchain';
import { fBI, fN } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Button } from '@heroui/button';
import Link from 'next/link';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import ListHeader from '../shared/ListHeader';
import { SmallTag } from '../shared/SmallTag';

interface Props {
    license: types.License;
}

const MIN_WIDTHS = {
    wallet: 'min-w-[78px]',
    percentage: 'min-w-[118px]',
    mined: 'min-w-[140px]',
    r1Balance: 'min-w-[92px]',
    usdcBalance: 'min-w-[110px]',
    transferredOut: 'min-w-[112px]',
} as const;

export default async function TreasuryWallets({ license }: Props) {
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
        r1Balance: bigint;
        usdcBalance: bigint;
        transferredOut: number;
        address: types.EthAddress;
        name: string;
        percentage: number;
    }[] = await Promise.all(
        treasuryWallets.map(async (wallet) => {
            try {
                const [r1Balance, usdcBalance, transferredOut] = await Promise.all([
                    fetchErc20Balance(wallet.address, config.r1ContractAddress),
                    fetchErc20Balance(wallet.address, config.usdcContractAddress),
                    fetchR1TransferredOutAmount(wallet.address),
                ]);
                return { ...wallet, r1Balance, usdcBalance, transferredOut };
            } catch (error) {
                console.error(`Error fetching data for ${wallet.name}:`, error);
                return { ...wallet, r1Balance: 0n, usdcBalance: 0n, transferredOut: 0 };
            }
        }),
    );

    return (
        <>
            <div className="row gap-3">
                <div className="card-title font-bold">Treasury Wallets</div>

                <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    as={Link}
                    href="https://ratio1.ai/blog/transparency-as-a-principle-not-a-slogan-and-why-we-re-sharing-our-foundation-wallets"
                    target="_blank"
                >
                    <div className="row gap-0.5">
                        <div className="text-sm font-medium">Read more</div>
                        <RiArrowRightUpLine className="mt-[1px] text-[18px]" />
                    </div>
                </Button>
            </div>

            <div className="list">
                <ListHeader useFixedWidthSmall>
                    <div className={MIN_WIDTHS.wallet}>Wallet</div>
                    <div className={MIN_WIDTHS.percentage}>% of GND</div>
                    <div className={MIN_WIDTHS.mined}>Mined/To be mined</div>
                    <div className={MIN_WIDTHS.r1Balance}>$R1 Balance</div>
                    <div className={MIN_WIDTHS.usdcBalance}>$USDC Balance</div>
                    <div className={MIN_WIDTHS.transferredOut}>Transferred Out</div>
                </ListHeader>

                <div className="col gap-1.5">
                    {balances
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((wallet) => (
                            <div key={wallet.address}>
                                <BorderedCard useCustomWrapper roundedSmall useFixedWidthSmall>
                                    <div className="row justify-between gap-3 py-3 lg:gap-6">
                                        <div className={MIN_WIDTHS.wallet}>
                                            <CardItem
                                                label="Wallet"
                                                value={
                                                    <Link
                                                        href={`${config.explorerUrl}/address/${wallet.address}`}
                                                        target="_blank"
                                                    >
                                                        <div className="text-slate-500 hover:text-primary">{wallet.name}</div>
                                                    </Link>
                                                }
                                            />
                                        </div>

                                        <div className={MIN_WIDTHS.percentage}>
                                            <CardItem
                                                label="% of GND"
                                                value={
                                                    <div className="font-medium">
                                                        <span className="text-slate-500">{wallet.percentage}%</span>{' '}
                                                        {wallet.percentage > 0 && (
                                                            <span>
                                                                (
                                                                {fBI(
                                                                    (license.totalAssignedAmount *
                                                                        BigInt(Math.round(wallet.percentage * 100))) /
                                                                        10000n,
                                                                    18,
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className={MIN_WIDTHS.mined}>
                                            <CardItem
                                                label="Mined/To be mined"
                                                value={
                                                    wallet.percentage > 0 ? (
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
                                                    ) : (
                                                        <div>
                                                            <SmallTag>Not mined</SmallTag>
                                                        </div>
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className={MIN_WIDTHS.r1Balance}>
                                            <CardItem
                                                label="$R1 Balance"
                                                value={
                                                    <div className="font-medium text-primary">{fBI(wallet.r1Balance, 18)}</div>
                                                }
                                            />
                                        </div>

                                        <div className={MIN_WIDTHS.usdcBalance}>
                                            <CardItem
                                                label="$USDC Balance"
                                                value={
                                                    <div className="font-medium text-slate-500">
                                                        {fBI(wallet.usdcBalance, 6)}
                                                    </div>
                                                }
                                            />
                                        </div>

                                        <div className={MIN_WIDTHS.transferredOut}>
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
