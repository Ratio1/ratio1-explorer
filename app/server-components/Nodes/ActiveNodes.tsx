import { getActiveNodesCached } from '@/app/page';
import * as types from '@/typedefs/blockchain';
import { RiErrorWarningLine } from 'react-icons/ri';
import { DetailedAlert } from '../shared/DetailedAlert';
import List from './List';

export default async function ActiveNodes({ currentPage }: { currentPage: number }) {
    const { response } = await getActiveNodesCached(currentPage);

    if (!response) {
        return <Error />;
    }

    const nodes: {
        [key: string]: types.NodeState;
    } = response.result.nodes;

    const pagesCount: number = response.result.nodes_total_pages;
    return <List nodes={nodes} pagesCount={pagesCount} currentPage={currentPage} />;
}

const Error = () => {
    return (
        <div className="center-all flex-1 py-4">
            <DetailedAlert
                icon={<RiErrorWarningLine />}
                title="API Issues"
                description={<div className="col">The Explorer is unable to retrieve node data at this time.</div>}
            />
        </div>
    );
};
