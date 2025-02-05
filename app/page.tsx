import { getOraclesInfo } from '@/lib/api/oracles';
import { OraclesDefaultResult } from '@/typedefs/blockchain';
import Footer from './server-components/Footer';
import TopBar from './server-components/TopBar';

export default async function Home() {
    const oraclesInfo: OraclesDefaultResult = await getOraclesInfo();

    return (
        <>
            <TopBar oraclesInfo={oraclesInfo} />

            <div className="center-all flex-1"></div>

            <Footer
                serverInfo={{
                    server_alias: oraclesInfo.result.server_alias,
                    server_version: oraclesInfo.result.server_version,
                    server_time: new Date(oraclesInfo.result.server_time).toLocaleString('ro-RO'),
                    server_current_epoch: oraclesInfo.result.server_current_epoch,
                    server_uptime: oraclesInfo.result.server_uptime,
                }}
            />
        </>
    );
}
