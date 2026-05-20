import * as types from './blockchain';
import { SearchResult } from './general';

const ethAddress = '0x1111111111111111111111111111111111111111' as types.EthAddress;
const internalAddress = '0xai_11111111111111111111111111111111111111111111' as types.R1Address;

const nodeSearchResult: SearchResult = {
    type: 'node',
    nodeAddress: ethAddress,
    internalAddress,
    alias: 'smart0',
    isOnline: true,
};

if (nodeSearchResult.type === 'node') {
    const copiedAddress: types.R1Address | undefined = nodeSearchResult.internalAddress;
    void copiedAddress;
}
