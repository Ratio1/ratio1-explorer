import { LiquidityManagerAbi } from '@/blockchain/LiquidityManager';
import config, { getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import { createContext, useContext, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { getBlockByTimestamp } from '../utils';
import { ERC20Abi } from '@/blockchain/ERC20';

export interface BlockchainContextType {
    // R1 Price
    r1Price: bigint;
    fetchR1Price: () => void;
    // Minted R1
    mintedR1InLastEpoch: bigint;
    fetchMintedR1InLastEpoch: () => Promise<void>;
    totalR1Supply: bigint;
    fetchTotalR1Supply: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [r1Price, setR1Price] = useState<bigint>(0n);
    const [mintedR1InLastEpoch, setMintedR1InLastEpoch] = useState<bigint>(0n);
    const [totalR1Supply, setTotalR1Supply] = useState<bigint>(0n);

    const publicClient = usePublicClient();

    const fetchR1Price = async () => {
        if (publicClient && config.liquidityManagerContractAddress.length === 42) {
            const price = await publicClient.readContract({
                address: config.liquidityManagerContractAddress,
                abi: LiquidityManagerAbi,
                functionName: 'getTokenPrice',
            });

            setR1Price(price);
        }
    };

    const fetchMintedR1InLastEpoch = async () => {
        if (!publicClient) {
            return;
        }

        const currentEpoch = getCurrentEpoch();
        const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
        const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

        const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000, publicClient);
        const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000, publicClient);

        const logs = await publicClient.getLogs({
            address: config.r1ContractAddress,
            event: ERC20Abi.find((v) => v.name === 'Transfer' && v.type === 'event')!,
            fromBlock,
            toBlock,
            args: {
                from: '0x0000000000000000000000000000000000000000',
            },
        });

        const mintedR1 = logs.reduce((acc, log) => acc + BigInt(log.args.value ?? 0), 0n);
        setMintedR1InLastEpoch(mintedR1);

        console.log({ mintedR1, logs });
    };

    const fetchTotalR1Supply = async () => {
        if (!publicClient) {
            return;
        }

        const totalSupply = await publicClient.readContract({
            address: config.liquidityManagerContractAddress,
            abi: ERC20Abi,
            functionName: 'totalSupply',
        });
        setTotalR1Supply(totalSupply);
    };

    return (
        <BlockchainContext.Provider
            value={{
                // R1 Price
                r1Price,
                fetchR1Price,
                // Minted R1
                mintedR1InLastEpoch,
                fetchMintedR1InLastEpoch,
                totalR1Supply,
                fetchTotalR1Supply,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};
