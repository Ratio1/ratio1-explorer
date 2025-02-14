import { getNodeLastEpoch } from '@/lib/api/oracles';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { isAddress } from 'viem';

type Props = {
    params: { nodeEthAddr: string };
};

export async function generateMetadata({ params }: Props) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr)) {
        notFound();
    }

    let response: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        response = await getLastEpoch(nodeEthAddr);
        console.log('response', response);
    } catch (error) {
        notFound();
    }

    return {
        title: `${response.node_alias} | Ratio1 Explorer`,
        openGraph: {
            title: `${response.node_alias} | Ratio1 Explorer`,
        },
    };
}

const getLastEpoch = cache(async (nodeEthAddr: string) => {
    const response = await getNodeLastEpoch(nodeEthAddr as types.EthAddress);
    return response;
});

export default async function NodePage({ params }: Props) {
    const { nodeEthAddr } = await params;

    let response: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        response = await getLastEpoch(nodeEthAddr);
        console.log('response', response);
    } catch (error) {
        notFound();
    }

    return (
        <div className="col flex-1 gap-6">
            <div className="col">
                <div className="text-[28px] font-bold">Node</div>
                <div className="text-lg font-medium text-slate-500">{response.node_alias}</div>
            </div>

            <div className="col gap-2">
                <div>{nodeEthAddr}</div>
            </div>
        </div>
    );
}
