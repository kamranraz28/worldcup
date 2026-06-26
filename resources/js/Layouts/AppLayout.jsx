import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';

import Sidebar from '@/Components/Layout/Sidebar';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import MobileMenu from '@/Components/Layout/MobileMenu';
import FlashMessage from '@/Components/FlashMessage';

export default function AppLayout({ children }) {
    const { url } = usePage();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof localStorage === 'undefined') return false;
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    const breadcrumbs = generateBreadcrumbs(url);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg flex selection:bg-primary-500/20">
            {/* Ambient gradient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/[0.04] via-primary-500/[0.02] to-transparent rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-gold-500/[0.03] via-primary-500/[0.01] to-transparent rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-primary-500/[0.02] via-transparent to-gold-500/[0.02] rounded-full blur-[120px]" />
                <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-l from-blue-500/[0.02] via-transparent to-transparent rounded-full blur-[100px]" />
            </div>

            {/* Sidebar - Desktop */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Mobile Menu Drawer */}
            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-out-quart
                ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}`}>

                {/* Top Navbar */}
                <Navbar
                    onMenuToggle={() => setMobileOpen(true)}
                    breadcrumbs={breadcrumbs}
                />

                {/* Flash Messages */}
                <FlashMessage />

                {/* Page Content */}
                <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 relative z-10">
                    <AnimatePresence mode="wait">
                        <div key={url} className="animate-fade-in-up">
                            {children}
                        </div>
                    </AnimatePresence>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

function generateBreadcrumbs(url) {
    const parts = url.split('/').filter(Boolean);
    const crumbs = [];

    const labelMap = {
        dashboard: 'Dashboard',
        events: 'Events',
        customers: 'Customers',
        verifications: 'Verifications',
        tickets: 'Tickets',
        campaigns: 'Campaigns',
        reports: 'Reports',
        admin: 'Administration',
        users: 'Users',
        roles: 'Roles',
        permissions: 'Permissions',
        create: 'Create',
        edit: 'Edit',
    };

    let path = '';
    for (const part of parts) {
        path += '/' + part;
        const label = labelMap[part] || part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        if (part === 'admin') continue;
        crumbs.push({ label, href: path });
    }

    return crumbs;
}
