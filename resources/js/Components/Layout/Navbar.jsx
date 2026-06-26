import { useState, useRef, useEffect, Fragment } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar({ onMenuToggle, breadcrumbs }) {
    const { auth } = usePage().props;
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const userMenuRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const user = auth.user;

    return (
        <>
            <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-2xl
                border-b border-neutral-100/60 dark:border-white/[0.04]
                shadow-[0_1px_4px_-2px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_4px_-2px_rgba(0,0,0,0.2)]">
                <div className="h-full flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center
                                text-neutral-500 dark:text-dark-text-secondary
                                hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                                active:scale-95 transition-all duration-150"
                            aria-label="Open menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Breadcrumb items={breadcrumbs} />
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center
                                text-neutral-400 dark:text-dark-text-secondary
                                hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                                active:scale-95 transition-all duration-150"
                            aria-label="Search"
                        >
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <ThemeSwitcher />

                        <div ref={notifRef} className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                                className="relative w-9 h-9 rounded-xl flex items-center justify-center
                                    text-neutral-400 dark:text-dark-text-secondary
                                    hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                                    active:scale-95 transition-all duration-150"
                                aria-label="Notifications"
                            >
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-dark-bg animate-ping-slow" />
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] overflow-hidden
                                            bg-white/80 dark:bg-dark-surface/90 backdrop-blur-2xl
                                            rounded-2xl border border-neutral-100/80 dark:border-white/[0.06]
                                            shadow-soft-xl dark:shadow-dark-xl z-50"
                                    >
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-white/[0.04]">
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Notifications</h3>
                                            <button className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors">
                                                Mark all read
                                            </button>
                                        </div>
                                        <div className="overflow-y-auto max-h-[380px] p-2 space-y-1">
                                            <NotificationItem title="Verification Approved" description="Ahmed Khan's identity verification was approved." time="2 min ago" unread />
                                            <NotificationItem title="Ticket Confirmed" description="Your Semi-Final viewing party ticket is confirmed." time="1 hour ago" unread />
                                            <NotificationItem title="New Campaign" description="World Cup Loyalty Rewards is now active. Join now!" time="3 hours ago" />
                                            <NotificationItem title="Event Reminder" description="Quarter-Final Live Screening starts in 24 hours." time="5 hours ago" />
                                            <NotificationItem title="Check-in Alert" description="842 fans checked in today. Great turnout!" time="8 hours ago" />
                                        </div>
                                        <div className="p-3 border-t border-neutral-100 dark:border-white/[0.04] text-center">
                                            <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-dark-text-secondary dark:hover:text-white transition-colors">
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div ref={userMenuRef} className="relative">
                            <button
                                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl
                                    hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                                    active:scale-[0.98] transition-all duration-150"
                                aria-label="User menu"
                            >
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600
                                    flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white leading-tight">
                                        {user?.name}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 dark:text-dark-text-secondary leading-tight">
                                        {user?.role?.display_name}
                                    </p>
                                </div>
                                <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="absolute right-0 top-full mt-2 w-[220px]
                                            bg-white/80 dark:bg-dark-surface/90 backdrop-blur-2xl
                                            rounded-2xl border border-neutral-100/80 dark:border-white/[0.06]
                                            shadow-soft-xl dark:shadow-dark-xl overflow-hidden z-50"
                                    >
                                        <div className="p-2 space-y-1">
                                            <UserMenuItem href="/profile" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                                Profile
                                            </UserMenuItem>
                                            <UserMenuItem href="/profile" icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                                Settings
                                            </UserMenuItem>

                                            <div className="my-1 border-t border-neutral-100 dark:border-white/[0.04]" />

                                            <button
                                                onClick={() => router.post(route('logout'))}
                                                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
                                                    text-neutral-500 dark:text-dark-text-secondary
                                                    hover:bg-red-50 dark:hover:bg-red-500/10
                                                    hover:text-red-600 dark:hover:text-red-400
                                                    transition-all duration-150 active:scale-[0.98]"
                                            >
                                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
            </AnimatePresence>
        </>
    );
}

function Breadcrumb({ items = [] }) {
    return (
        <nav className="hidden sm:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <Link href="/dashboard" className="text-neutral-400 dark:text-dark-text-secondary hover:text-neutral-600
                dark:hover:text-white/70 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </Link>
            {items.map((item, i) => (
                <Fragment key={i}>
                    <svg className="w-3.5 h-3.5 text-neutral-300 dark:text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {i === items.length - 1 ? (
                        <span className="font-medium text-neutral-900 dark:text-white">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="text-neutral-400 dark:text-dark-text-secondary
                            hover:text-neutral-600 dark:hover:text-white/70 transition-colors">
                            {item.label}
                        </Link>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}

function UserMenuItem({ href, icon, children }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                text-neutral-500 dark:text-dark-text-secondary
                hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                hover:text-neutral-700 dark:hover:text-white
                transition-all duration-150 active:scale-[0.98]"
        >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {children}
        </Link>
    );
}

function NotificationItem({ title, description, time, unread }) {
    return (
        <button className={`w-full text-left p-3 rounded-xl transition-all duration-150
            ${unread ? 'bg-primary-500/[0.04] dark:bg-primary-500/[0.06]' : 'hover:bg-neutral-50 dark:hover:bg-white/[0.02]'}`}>
            <div className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${unread ? 'bg-primary-500' : 'bg-transparent'}`} />
                <div className="min-w-0">
                    <p className={`text-sm leading-snug ${unread ? 'font-semibold text-neutral-900 dark:text-white' : 'font-medium text-neutral-600 dark:text-dark-text-secondary'}`}>
                        {title}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-dark-text-secondary mt-0.5 line-clamp-2">{description}</p>
                    <p className="text-[11px] text-neutral-400/70 dark:text-dark-text-secondary/70 mt-1">{time}</p>
                </div>
            </div>
        </button>
    );
}

function SearchModal({ onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        inputRef.current?.focus();
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        >
            <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-2xl
                    rounded-2xl border border-neutral-100/80 dark:border-white/[0.06]
                    shadow-soft-2xl dark:shadow-dark-xl overflow-hidden"
            >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-white/[0.04]">
                    <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search events, customers, tickets..."
                        className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white
                            placeholder-neutral-400 dark:placeholder-dark-text-secondary
                            outline-none border-none"
                        aria-label="Search"
                    />
                    <kbd className="kbd hidden sm:inline-flex">ESC</kbd>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto">
                    <p className="text-xs text-neutral-400 dark:text-dark-text-secondary px-3 py-4 text-center">
                        {query ? 'No results found' : 'Type to start searching...'}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
