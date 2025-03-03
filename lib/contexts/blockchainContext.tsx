import { ERC20Abi } from '@/blockchain/ERC20';
import { LiquidityManagerAbi } from '@/blockchain/LiquidityManager';
import config, { getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import { createContext, useContext, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { getBlockByTimestamp } from '../api/blockchain';
import { ETH_EMPTY_ADDR } from '../utils';

export interface BlockchainContextType {
    // R1 Price
    r1Price: bigint;
    fetchR1Price: () => void;
    // R1 Minted last epoch
    R1MintedLastEpoch: bigint | undefined;
    fetchR1MintedLastEpoch: () => Promise<void>;
    // R1 Total supply
    R1TotalSupply: bigint | undefined;
    fetchR1TotalSupply: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [r1Price, setR1Price] = useState<bigint>(0n);
    const [R1MintedLastEpoch, setR1MintedLastEpoch] = useState<bigint>();
    const [R1TotalSupply, setR1TotalSupply] = useState<bigint>();

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

    const fetchR1MintedLastEpoch = async () => {
        if (!publicClient) {
            return;
        }

        const currentEpoch = getCurrentEpoch();
        const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
        const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

        const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
        const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

        const logs = await publicClient.getLogs({
            address: config.r1ContractAddress,
            event: ERC20Abi.find((v) => v.name === 'Transfer' && v.type === 'event')!,
            fromBlock,
            toBlock,
            args: {
                from: ETH_EMPTY_ADDR,
            },
        });

        const value = logs.reduce((acc, log) => acc + BigInt(log.args.value ?? 0), 0n);
        setR1MintedLastEpoch(value);
    };

    const fetchR1TotalSupply = async () => {
        if (!publicClient) {
            return;
        }

        try {
            const totalSupply = await publicClient.readContract({
                address: config.r1ContractAddress,
                abi: ERC20Abi,
                functionName: 'totalSupply',
            });
            setR1TotalSupply(totalSupply);
        } catch (error) {
            console.error('Error fetching R1 total supply');
        }
    };

    return (
        <BlockchainContext.Provider
            value={{
                // R1 Price
                r1Price,
                fetchR1Price,
                // R1 Minted last epoch
                R1MintedLastEpoch,
                fetchR1MintedLastEpoch,
                // R1 Total supply
                R1TotalSupply,
                fetchR1TotalSupply,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};
