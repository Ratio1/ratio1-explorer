import { getLicenseHolders } from '@/lib/api/blockchain';
import * as types from '@/typedefs/blockchain';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure API route is not cached

export async function GET() {
    try {
        const [ndHolders, mndHolders] = await Promise.all([getLicenseHolders('ND'), getLicenseHolders('MND')]);

        const response = {
            ndHolders: ndHolders
                .filter((holder) => !!holder.ownerOf)
                .map((holder) => ({
                    ethAddress: holder.ownerOf as unknown as types.EthAddress,
                    licenseId: typeof holder.tokenId === 'string' ? parseInt(holder.tokenId, 10) : holder.tokenId,
                })),
            mndHolders: mndHolders
                .filter((holder) => !!holder.ownerOf)
                .map((holder) => ({
                    ethAddress: holder.ownerOf as unknown as types.EthAddress,
                    licenseId: typeof holder.tokenId === 'string' ? parseInt(holder.tokenId, 10) : holder.tokenId,
                })),
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
