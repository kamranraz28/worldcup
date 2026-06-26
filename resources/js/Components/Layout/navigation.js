import { motion } from 'framer-motion';

const paths = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    events: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    customers: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    verifications: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    tickets: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    checkin: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    campaigns: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
    reports: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    administration: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    profile: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
};

export const navItems = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: paths.dashboard, permission: null },
    { key: 'events', label: 'Events', href: '/events', icon: paths.events, permission: 'events.view' },
    { key: 'customers', label: 'Customers', href: '/customers', icon: paths.customers, permission: 'customers.view' },
    { key: 'verifications', label: 'Verifications', href: '/verifications', icon: paths.verifications, permission: 'verifications.view' },
    { key: 'checkin', label: 'Scan In', href: '/check-in', icon: paths.checkin, permission: 'checkins.scan' },
    { key: 'tickets', label: 'Tickets', href: '/tickets', icon: paths.tickets, permission: 'tickets.view' },
    { key: 'campaigns', label: 'Campaigns', href: '/campaigns', icon: paths.campaigns, permission: 'campaigns.view' },
    { key: 'reports', label: 'Reports', href: '/reports', icon: paths.reports, permission: 'reports.view' },
];

export const customerNavItems = [
    { key: 'customer-dashboard', label: 'Dashboard', href: '/customer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'my-tickets', label: 'My Tickets', href: '/my-tickets', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
];

export const adminNavItems = [
    { key: 'users', label: 'Users', href: '/admin/users', icon: paths.profile, permission: 'users.view' },
    { key: 'roles', label: 'Roles', href: '/admin/roles', icon: paths.administration, permission: 'roles.view' },
    { key: 'permissions', label: 'Permissions', href: '/admin/permissions', icon: paths.administration, permission: 'roles.view' },
    { key: 'settings', label: 'Settings', href: '/admin/settings', icon: paths.administration, permission: 'configs.edit' },
];
