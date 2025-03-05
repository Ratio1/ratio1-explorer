export const routePath = {
    // Lists
    root: '/', // Nodes
    licenses: '/licenses',
    owners: '/accounts',
    // Individual items
    node: '/node',
    license: '/license',
    owner: '/account',
};

export const routeTitles = {
    [routePath.root]: 'Nodes',
    [routePath.licenses]: 'Licenses',
    [routePath.owners]: 'Accounts',
};

export const navRoutes = [routePath.root, routePath.licenses, routePath.owners];
