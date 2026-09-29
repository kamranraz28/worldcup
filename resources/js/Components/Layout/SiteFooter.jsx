import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const EXPLORE = [
    { label: 'Browse Events', href: '/browse' },
    { label: 'Track Tickets', href: '/track-tickets' },
    { label: 'Staff Login', href: '/login' },
];

const HELP = [
    { label: 'Book a ticket', href: '/browse' },
    { label: 'Download my tickets', href: '/track-tickets' },
];

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 mt-24 overflow-hidden">
            {/* Ambient glow behind the footer */}
            <div className="pointer-events-none absolute -bottom-[140px] left-1/2 -translate-x-1/2 h-[320px] w-[760px] rounded-full bg-primary-500/[0.08] blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-[100px] right-[8%] h-[260px] w-[380px] rounded-full bg-gold-500/[0.06] blur-[130px]" />

            <div className="relative">
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

                <div className="mx-auto max-w-7xl px-6 pt-14 pb-8">
                    {/* Presented by — Synergy highlight */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-14 max-w-2xl rounded-3xl bg-gradient-to-r from-primary-500/[0.08] via-white/[0.03] to-gold-500/[0.08] p-px
                            shadow-[0_0_50px_-10px_rgba(255,213,79,0.35),0_0_24px_-8px_rgba(227,6,19,0.25)]"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-3 rounded-3xl px-8 py-6 sm:flex-row sm:gap-5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/90">Presented by</span>
                            <span className="hidden h-5 w-px bg-gold-500/25 sm:block" />
                            <a
                                href="https://synergyinterface.com/web/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.03]"
                            >
                                <img
                                    src={appUrl('/synergy.png')}
                                    alt="Synergy Interface Ltd"
                                    className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
                                    style={{ filter: 'drop-shadow(0 0 14px rgba(255,213,79,0.5))' }}
                                />
                                <span className="text-sm font-bold tracking-wide text-white/85 underline-offset-4 transition-colors group-hover:text-white group-hover:underline">
                                    Synergy Interface Ltd.
                                </span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Main columns */}
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Brand */}
                        <div>
                            <Link href={appUrl('/')} className="flex items-center gap-2.5 group">
                                <img
                                    src={appUrl('/ticketclub.png')}
                                    alt="TicketClub"
                                    className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className="text-lg font-extrabold tracking-tight text-white">TicketClub</span>
                            </Link>
                            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                                Book tickets in seconds, pay securely, and carry your QR pass straight to the gate — no account needed.
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[11px] font-medium tracking-wide text-white/50">Booking is live</span>
                            </div>
                        </div>

                        {/* Explore */}
                        <div>
                            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-white/50">Explore</h4>
                            <ul className="space-y-3.5">
                                {EXPLORE.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={appUrl(item.href)}
                                            className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                                        >
                                            <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-3.5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Your ticket */}
                        <div>
                            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-white/50">Your Ticket</h4>
                            <ul className="space-y-3.5">
                                {HELP.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={appUrl(item.href)}
                                            className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                                        >
                                            <span className="h-px w-0 bg-primary-400 transition-all duration-300 group-hover:w-3.5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/[0.05]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row">
                        <p className="text-xs text-white/30">
                            &copy; {year}{' '}
                            <a
                                href="https://synergyinterface.com/web/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gold-500/80 transition-colors hover:text-gold-400 hover:underline underline-offset-2"
                            >
                                Synergy Interface Ltd.
                            </a>{' '}
                            All rights reserved.
                        </p>
                        <p className="text-xs text-white/25">
                            Crafted with <span className="text-primary-400">&hearts;</span> by{' '}
                            <a
                                href="https://synergyinterface.com/web/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-white/40 transition-colors hover:text-white hover:underline underline-offset-2"
                            >
                                Synergy Interface Ltd.
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}