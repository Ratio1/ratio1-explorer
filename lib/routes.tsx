import { RiComputerLine, RiCpuLine, RiWalletLine } from 'react-icons/ri';

export const routePath = {
    // Lists
    root: '/', // Nodes
    licenses: '/licenses',
    owners: '/accounts',
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
};

export const routeIcons = {
    [routePath.root]: <RiComputerLine />,
    [routePath.licenses]: <RiCpuLine />,
    [routePath.owners]: <RiWalletLine />,
};

export const navRoutes = [routePath.root, routePath.licenses, routePath.owners];
