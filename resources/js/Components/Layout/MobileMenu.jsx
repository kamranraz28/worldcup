import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, adminNavItems } from './navigation';

const drawerVariants = {
    hidden: { x: '-100%', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    visible: { x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

export default function MobileMenu({ open, onClose }) {
    const { url, auth } = usePage().props;
    const permissions = auth.user?.permissions ?? [];

    const filteredNav = navItems.filter(
        (item) => !item.permission || permissions.includes(item.permission)
    );

    const isActive = (href) => {
        if (href === '/dashboard') return url === '/dashboard';
        return url.startsWith(href);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />

                    <motion.aside
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed top-0 left-0 z-50 h-full w-[280px] lg:hidden
                            bg-white/90 dark:bg-dark-bg/95 backdrop-blur-2xl
                            border-r border-neutral-100 dark:border-white/[0.04]
                            shadow-[4px_0_40px_-8px_rgba(0,0,0,0.15)]
                            dark:shadow-[4px_0_40px_-8px_rgba(0,0,0,0.4)]
                            flex flex-col"
                    >
                        <div className="flex-shrink-0 h-16 flex items-center justify-between px-5 border-b border-neutral-100 dark:border-white/[0.04]">
                            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600
                                    flex items-center justify-center shadow-lg shadow-primary-500/25">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                                        TOFFEE
                                    </span>
                                    <span className="text-[9px] font-semibold tracking-widest uppercase text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded ml-2">
                                        WC 2026
                                    </span>
                                </div>
                            </Link>
                            <button onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400
                                    hover:bg-neutral-100 dark:hover:bg-white/[0.04] active:scale-95 transition-all"
                                aria-label="Close menu">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-4 space-y-0.5 scrollbar-thin">
                            {filteredNav.map((item) => (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive(item.href)
                                            ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400'
                                            : 'text-neutral-500 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-white/[0.03]'
                                        }`}
                                    aria-current={isActive(item.href) ? 'page' : undefined}
                                >
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            ))}

                            {(auth.user?.role?.name === 'super-admin' || auth.user?.role?.name === 'admin') && (
                                <>
                                    <div className="divider my-3" />
                                    <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400/70 dark:text-dark-text-secondary/60 px-3 pb-1">
                                        Administration
                                    </p>

                                    {adminNavItems.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-medium transition-all
                                                ${isActive(item.href)
                                                    ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-600 dark:text-primary-400'
                                                    : 'text-neutral-500 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-white/[0.03]'
                                                }`}
                                            aria-current={isActive(item.href) ? 'page' : undefined}
                                        >
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </nav>

                        <div className="flex-shrink-0 p-4 border-t border-neutral-100 dark:border-white/[0.04]">
                            <div className="flex items-center gap-3 px-1">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600
                                    flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                    {auth.user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                        {auth.user?.name}
                                    </p>
                                    <p className="text-xs text-neutral-400 dark:text-dark-text-secondary truncate">
                                        {auth.user?.role?.display_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
