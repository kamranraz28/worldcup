import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, adminNavItems, customerNavItems } from './navigation';

const sidebarVariants = {
    open: { width: 280, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
    closed: { width: 72, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
};

export default function Sidebar({ collapsed, onToggle, onMobileClose }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const permissions = auth.user?.permissions ?? [];
    const roleName = auth.user?.role?.name;
    const isAdmin = roleName === 'super-admin' || roleName === 'admin';
    const isCustomer = roleName === 'customer';
    const isScanningStaff = roleName === 'checkin-staff';

    const filteredNav = navItems.filter(
        (item) => !item.permission || permissions.includes(item.permission)
    );

    const filteredAdmin = adminNavItems.filter(
        (item) => !item.permission || permissions.includes(item.permission)
    );

    let sideItems;
    if (isCustomer) {
        sideItems = customerNavItems;
    } else if (isScanningStaff) {
        sideItems = filteredNav.filter(item => item.key === 'checkin');
    } else {
        sideItems = filteredNav;
    }

    const isActive = (href) => {
        if (href === '/dashboard') return url === '/dashboard';
        return url.startsWith(href);
    };

    return (
        <motion.aside
            variants={sidebarVariants}
            animate={collapsed ? 'closed' : 'open'}
            initial={false}
            className="fixed top-0 left-0 z-40 h-full hidden lg:flex flex-col
                bg-white/70 dark:bg-dark-bg/80
                backdrop-blur-2xl
                border-r border-neutral-100/60 dark:border-white/[0.04]
                shadow-[4px_0_32px_-8px_rgba(0,0,0,0.04)]
                dark:shadow-[4px_0_32px_-8px_rgba(0,0,0,0.3)]
                overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-primary-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Logo */}
                <div className="flex-shrink-0 h-16 flex items-center px-5 border-b border-neutral-100/60 dark:border-white/[0.04]">
                    <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600
                            flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25
                            group-hover:shadow-xl group-hover:shadow-primary-500/35 transition-all duration-300">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 min-w-0"
                                >
                                    <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                                        TOFFEE
                                    </span>
                                    <span className="text-[9px] font-semibold tracking-widest uppercase
                                        text-primary-500 dark:text-primary-400
                                        bg-primary-500/10 dark:bg-primary-500/15
                                        px-1.5 py-0.5 rounded">
                                        WC 2026
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Toggle */}
                <button
                    onClick={onToggle}
                    className="flex-shrink-0 mx-3 mt-3 mb-1 h-8 rounded-xl flex items-center justify-center
                        text-neutral-400 dark:text-dark-text-secondary
                        hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                        transition-colors duration-200 group"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg className={`w-4 h-4 transition-all duration-300 ease-out-quart ${collapsed ? '' : 'rotate-180'}
                        group-hover:text-neutral-600 dark:group-hover:text-dark-text`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-0.5 scrollbar-thin">
                    {sideItems.map((item, i) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => onMobileClose?.()}
                                className={`group relative flex items-center h-10 rounded-xl transition-all duration-200 ease-out-quart
                                    ${isActive(item.href)
                                        ? 'bg-gradient-to-r from-primary-500/12 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5'
                                        : 'hover:bg-neutral-100/60 dark:hover:bg-white/[0.03]'
                                    }`}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                                {isActive(item.href) && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5
                                            bg-primary-500 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}

                                <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'justify-center w-full' : 'px-3'}`}>
                                    <div className={`w-5 h-5 flex-shrink-0 transition-all duration-200
                                        ${isActive(item.href)
                                            ? 'text-primary-500 scale-110'
                                            : 'text-neutral-400 dark:text-dark-text-secondary group-hover:text-neutral-600 dark:group-hover:text-white/70'
                                        }`}>
                                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1, transition: { duration: 0.1, delay: 0.05 } }}
                                                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                                                className={`text-sm font-medium truncate
                                                    ${isActive(item.href)
                                                        ? 'text-neutral-900 dark:text-white'
                                                        : 'text-neutral-500 dark:text-dark-text-secondary group-hover:text-neutral-700 dark:group-hover:text-dark-text'
                                                    }`}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-900 dark:bg-white
                                        text-white dark:text-neutral-900 text-xs font-medium rounded-lg
                                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                        transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Admin section */}
                    {isAdmin && filteredAdmin.length > 0 && (
                        <>
                            <div className={`my-3 ${collapsed ? 'h-px bg-neutral-200/60 dark:bg-white/[0.06] mx-2' : 'px-3'}`}>
                                {!collapsed && (
                                    <p className="text-[10px] font-semibold tracking-widest uppercase
                                        text-neutral-400/70 dark:text-dark-text-secondary/60 pt-2 pb-1">
                                        Administration
                                    </p>
                                )}
                            </div>

                            {filteredAdmin.map((item, i) => (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (filteredNav.length + i) * 0.04 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => onMobileClose?.()}
                                        className={`group relative flex items-center h-10 rounded-xl transition-all duration-200 ease-out-quart
                                            ${isActive(item.href)
                                                ? 'bg-gradient-to-r from-primary-500/12 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5'
                                                : 'hover:bg-neutral-100/60 dark:hover:bg-white/[0.03]'
                                            }`}
                                        aria-current={isActive(item.href) ? 'page' : undefined}
                                    >
                                        {isActive(item.href) && (
                                            <motion.div
                                                layoutId="sidebar-active-admin"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5
                                                    bg-primary-500 rounded-r-full"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}

                                        <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'justify-center w-full' : 'px-3'}`}>
                                            <div className={`w-5 h-5 flex-shrink-0 transition-all duration-200
                                                ${isActive(item.href)
                                                    ? 'text-primary-500 scale-110'
                                                    : 'text-neutral-400 dark:text-dark-text-secondary group-hover:text-neutral-600 dark:group-hover:text-white/70'
                                                }`}>
                                                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                                </svg>
                                            </div>

                                            <AnimatePresence mode="wait">
                                                {!collapsed && (
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1, transition: { duration: 0.1, delay: 0.05 } }}
                                                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                                                        className={`text-sm font-medium truncate
                                                            ${isActive(item.href)
                                                                ? 'text-neutral-900 dark:text-white'
                                                                : 'text-neutral-500 dark:text-dark-text-secondary group-hover:text-neutral-700 dark:group-hover:text-dark-text'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {collapsed && (
                                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-900 dark:bg-white
                                                text-white dark:text-neutral-900 text-xs font-medium rounded-lg
                                                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                                transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </>
                    )}
                </nav>

                {/* Bottom gradient fade */}
                <div className="flex-shrink-0 h-6 bg-gradient-to-t from-white/80 dark:from-dark-bg/80 to-transparent pointer-events-none relative z-10" />
            </div>
        </motion.aside>
    );
}
