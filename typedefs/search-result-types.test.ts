import * as types from './blockchain';
import { NodeSearchResources, SearchResult } from './general';

const ethAddress = '0x1111111111111111111111111111111111111111' as types.EthAddress;
const internalAddress = '0xai_11111111111111111111111111111111111111111111' as types.R1Address;

const nodeSearchResult: SearchResult = {
    type: 'node',
    nodeAddress: ethAddress,
    internalAddress,
    alias: 'smart0',
    isOnline: true,
    tags: ['REG:EU', 'CT:DE', 'IS_KYB', 'DC:hostinger'],
    resources: { cpu_cores: 4, cpu_cores_avail: 3.2, mem_avail: 13.2, mem_total: 15.6 },
};

if (nodeSearchResult.type === 'node') {
    const copiedAddress: types.R1Address | undefined = nodeSearchResult.internalAddress;
    void copiedAddress;

    const tags: string[] | undefined = nodeSearchResult.tags;
    void tags;

    const resources: NodeSearchResources | undefined = nodeSearchResult.resources;
    void resources;
}
