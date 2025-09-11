import { RiBarChartBoxLine, RiComputerLine, RiCpuLine, RiEye2Line, RiWalletLine } from 'react-icons/ri';

export const routePath = {
    // Lists
    root: '/', // Nodes
    licenses: '/licenses',
    owners: '/accounts',
    stats: '/stats',
    oracles: '/oracles',
    // Individual items
    node: '/node',
    license: '/license',
    owner: '/account',
    // Other
    search: '/search',
    notFound: '/404',
};

export const routeTitles = {
    [routePath.root]: 'Nodes',
    [routePath.licenses]: 'Licenses',
    [routePath.owners]: 'Accounts',
    [routePath.stats]: 'Stats',
    [routePath.oracles]: 'Oracles',
};

export const routeIcons = {
    [routePath.root]: <RiComputerLine />,
    [routePath.licenses]: <RiCpuLine />,
    [routePath.owners]: <RiWalletLine />,
    [routePath.stats]: <RiBarChartBoxLine />,
    [routePath.oracles]: <RiEye2Line />,
};

export const navRoutes = [routePath.root, routePath.licenses, routePath.owners, routePath.stats, routePath.oracles];
