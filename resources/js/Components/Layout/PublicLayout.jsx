import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import SiteFooter from './SiteFooter';

/**
 * Shared shell for every public-facing page (homepage-adjacent pages, event
 * browsing, guest checkout, ticket tracking). No account is required.
 */
export default function PublicLayout({ children }) {

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-dark-bg via-[#0F0F1A] to-dark-bg overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary-500/[0.06] rounded-full blur-[180px]" />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold-500/[0.04] rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-500/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-2/3 right-1/3 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />

            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 4 + 1,
                        height: Math.random() * 4 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{ y: [0, -30, 0], opacity: [0, 0.08, 0] }}
                    transition={{ duration: 12 + Math.random() * 15, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 8 }}
                />
            ))}

            <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <Link href={appUrl("/")} className="flex items-center gap-2.5 group">
                    <img src={appUrl("/ticketclub.png")} alt="TicketClub"
                        className="h-8 w-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                    <span className="text-xl font-extrabold tracking-tight text-white">TicketClub</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href={appUrl("/browse")} className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">Events</Link>
                    <Link href={appUrl("/track-tickets")} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">Track Tickets</Link>
                    <Link href={appUrl("/login")} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">Staff Sign In</Link>
                </div>
            </nav>

            <main className="relative z-10">{children}</main>

            <SiteFooter />
        </div>
    );
}