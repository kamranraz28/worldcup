import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

const easeOut = [0.22, 1, 0.36, 1];
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } };

const NAV_LINKS = [
    { label: 'Events', href: '/browse' },
    { label: 'Track Tickets', href: '/track-tickets' },
    { label: 'Staff Sign In', href: '/login' },
];

/**
 * Sticky glass navbar + animated full-screen mobile menu, shared by all
 * public pages. On mobile the two-tone TicketClub wordmark sits centred
 * between the logo and the actions, and the theme toggle lives right before
 * the menu (hamburger) button.
 */
export default function PublicNavbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const close = () => setOpen(false);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
                    scrolled ? 'border-b border-neutral-200 dark:border-white/[0.06] bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl' : ''
                }`}
            >
                <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    {/* Left: logo */}
                    <Link href={appUrl('/')} className="group relative z-10 flex items-center gap-2.5" onClick={close}>
                        <img src={appUrl('/ticketclub.png')} alt="TicketClub"
                            className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
                        <span className="hidden text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white md:inline">TicketClub</span>
                    </Link>

                    {/* Centre: two-tone wordmark (mobile only) */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
                        <Link href={appUrl('/')} onClick={close}
                            className="flex items-center text-lg font-extrabold tracking-tight">
                            <span className="text-neutral-900 dark:text-white">Ticket</span>
                            <span className="bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-transparent">Club</span>
                        </Link>
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-1 md:flex">
                        {NAV_LINKS.map((l) => (
                            <Link key={l.label} href={appUrl(l.href)}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 dark:text-white/60 transition-colors hover:bg-neutral-100 dark:hover:bg-white/[0.05] hover:text-neutral-900 dark:hover:text-white">
                                {l.label}
                            </Link>
                        ))}
                        <div className="ml-1"><ThemeSwitcher /></div>
                        <Link href={appUrl('/browse')} className="ml-2 btn-primary px-5 py-2 text-sm sm:px-6">
                            Book now
                        </Link>
                    </div>

                    {/* Mobile actions: theme toggle, then menu button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-neutral-900 dark:text-white"
                        >
                            <div className="relative h-4 w-5">
                                <span className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : ''}`} />
                                <span className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                                <span className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''}`} />
                            </div>
                        </button>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-30 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-2xl md:hidden"
                    >
                        <div className="relative flex h-full flex-col justify-center px-6">
                            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-2">
                                {[
                                    { label: 'Home', href: appUrl('/') },
                                    ...NAV_LINKS.map((l) => ({ label: l.label, href: appUrl(l.href) })),
                                    { label: 'Book Events', href: appUrl('/browse'), primary: true },
                                ].map((l) => (
                                    <motion.div key={l.label} variants={fadeUp}>
                                        <Link
                                            href={l.href}
                                            onClick={close}
                                            className={`block rounded-2xl px-5 py-4 text-2xl font-extrabold tracking-tight transition-colors ${
                                                l.primary
                                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400'
                                                    : 'text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white'
                                            }`}
                                        >
                                            {l.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.p variants={fadeUp} initial="hidden" animate="visible"
                                className="absolute bottom-10 left-6 right-6 text-sm text-neutral-400 dark:text-white/30">
                                Book tickets in seconds · Pay securely · Scan at the gate
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}