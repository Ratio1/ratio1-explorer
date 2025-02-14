import { getActiveNodes } from '@/lib/api/oracles';
import { OraclesDefaultResult } from '@/typedefs/blockchain';
import Footer from './server-components/Footer';
import List from './server-components/Nodes/List';
import TopBar from './server-components/TopBar';

export default async function Home(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    console.log('Calling getActiveNodes for page', currentPage);
    const oraclesInfo: OraclesDefaultResult = await getActiveNodes();

    return (
        <>
            <TopBar oraclesInfo={oraclesInfo} />

            <List nodes={oraclesInfo.result.nodes} currentPage={currentPage} />

            <Footer
                serverInfo={{
                    server_alias: oraclesInfo.result.server_alias,
                    server_version: oraclesInfo.result.server_version,
                    server_time: new Date(oraclesInfo.result.server_time).toLocaleString(),
                    server_current_epoch: oraclesInfo.result.server_current_epoch,
                    server_uptime: oraclesInfo.result.server_uptime,
                }}
            />
        </>
    );
}
