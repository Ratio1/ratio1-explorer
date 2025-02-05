import { RoundedCard } from '@/components/shared/RoundedCard';
import { getOraclesInfo } from '@/lib/api/oracles';
import { OraclesDefaultResult } from '@/typedefs/blockchain';
import Footer from './server-components/Footer';
import TopBar from './server-components/TopBar';

export default async function Home() {
    const oraclesInfo: OraclesDefaultResult = await getOraclesInfo();
    console.log(oraclesInfo);

    return (
        <>
            <TopBar oraclesInfo={oraclesInfo} />

            <div className="center-all flex-1">
                <div className="col gap-3">
                    {Object.entries(oraclesInfo.result.nodes)
                        .slice(1)
                        .map(([ratio1Addr, node]) => (
                            <div key={ratio1Addr}>
                                <RoundedCard>
                                    <div className="row justify-between gap-8 px-6 py-3.5">
                                        <h3 className="font-bold">{ratio1Addr}</h3>
                                        <p>{node.alias}</p>
                                    </div>
                                </RoundedCard>
                            </div>
                        ))}
                </div>
            </div>

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
