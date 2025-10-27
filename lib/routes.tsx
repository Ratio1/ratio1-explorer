import { RiBarChartBoxLine, RiComputerLine, RiCpuLine, RiWalletLine } from 'react-icons/ri';

export const routePath = {
    // Lists
    root: '/', // Nodes
    licenses: '/licenses',
    nodeOperators: '/node-operators',
    stats: '/stats',
    // Individual items
    node: '/node',
    license: '/license',
    nodeOperator: '/node-operator',
    // Other
    search: '/search',
    notFound: '/404',
};

export const routeTitles = {
    [routePath.root]: 'Nodes',
    [routePath.licenses]: 'Licenses',
    [routePath.nodeOperators]: 'Node Operators',
    [routePath.stats]: 'Stats',
};

export const routeIcons = {
    [routePath.root]: <RiComputerLine />,
    [routePath.licenses]: <RiCpuLine />,
    [routePath.nodeOperators]: <RiWalletLine />,
    [routePath.stats]: <RiBarChartBoxLine />,
};

export const navRoutes = [routePath.root, routePath.licenses, routePath.nodeOperators, routePath.stats];
