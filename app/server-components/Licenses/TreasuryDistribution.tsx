import { treasuryWallets } from '@/config';
import { getServerConfig } from '@/config/serverConfig';
import { fetchErc20Balance } from '@/lib/api/blockchain';
import { fBI, fN } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';

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

            <div className="col gap-2">
                {balances.map((wallet) => (
                    <div className="row gap-4 text-sm font-medium" key={wallet.address}>
                        <div className="text-slate-500">{wallet.name}</div>
                        <div className="font-medium text-primary">{wallet.percentage}%</div>

                        <div className="row gap-2">
                            <div className="">
                                {fBI((license.totalClaimedAmount * BigInt(Math.round(wallet.percentage * 100))) / 10000n, 18)}/
                                {fBI((license.totalAssignedAmount * BigInt(Math.round(wallet.percentage * 100))) / 10000n, 18)}
                            </div>

                            <div className="text-slate-500">(R1 Balance: {fBI(wallet.balance, 18)})</div>

                            {!!wallet.transferredOut && (
                                <div className="text-slate-500">(Transferred Out: {fN(wallet.transferredOut)})</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
