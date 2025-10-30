import { RiBarChartBoxLine, RiCloudLine, RiComputerLine, RiCpuLine, RiWalletLine } from 'react-icons/ri';

export const routePath = {
    // Main navigation
    root: '/', // Nodes
    licenses: '/licenses',
    nodeOperators: '/node-operators',
    csps: '/cloud-service-providers',
    stats: '/stats',
    // Individual items
    node: '/node',
    license: '/license',
    account: '/account',
    // Other
    search: '/search',
    notFound: '/404',
};

export const routeTitles = {
    [routePath.root]: 'Nodes',
    [routePath.licenses]: 'Licenses',
    [routePath.nodeOperators]: 'Node Operators',
    [routePath.csps]: 'CSPs',
    [routePath.stats]: 'Stats',
};

export const mobileRouteTitles = {
    [routePath.root]: 'Nodes',
    [routePath.licenses]: 'Licenses',
    [routePath.nodeOperators]: 'Operators',
    [routePath.csps]: 'CSPs',
    [routePath.stats]: 'Stats',
};

export const routeIcons = {
    [routePath.root]: <RiComputerLine />,
    [routePath.licenses]: <RiCpuLine />,
    [routePath.nodeOperators]: <RiWalletLine />,
    [routePath.stats]: <RiBarChartBoxLine />,
    [routePath.csps]: <RiCloudLine />,
};

export const navRoutes = [routePath.root, routePath.licenses, routePath.nodeOperators, routePath.csps, routePath.stats];
