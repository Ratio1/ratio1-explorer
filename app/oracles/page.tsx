import { getOracleFees } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { redirect } from 'next/navigation';
import List from '../server-components/Oracles/List';

export async function generateMetadata() {
    return {
        title: 'Oracles',
        openGraph: {
            title: 'Oracles',
        },
    };
}

export default async function OraclesPage() {
    let entries: types.OracleFees[];

    try {
        entries = await getOracleFees();
        console.log(entries);
    } catch (error) {
        console.error(error);
        console.log('[OraclesPage] Failed to fetch oracle fees');
        redirect(routePath.notFound);
    }

    return <List entries={entries} />;
}
