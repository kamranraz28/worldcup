import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

const statusColors = {
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending_approval: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    reserved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    redeemed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export default function MyTickets({ tickets, stats }) {
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—';

    return (
        <AppLayout>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">My Tickets</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">View and download your event tickets</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Tickets', value: stats?.total || 0, color: 'text-white' },
                        { label: 'Confirmed', value: stats?.confirmed || 0, color: 'text-green-400' },
                        { label: 'Redeemed', value: stats?.redeemed || 0, color: 'text-purple-400' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="glass-card p-4"
                        >
                            <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                        </motion.div>
                    ))}
                </div>

                {tickets?.data?.length > 0 ? (
                    <div className="space-y-3">
                        {tickets.data.map((t, i) => (
                            <motion.div key={t.uuid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
                                            {t.event?.title || 'Event'}
                                        </h3>
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusColors[t.status] || 'bg-neutral-500/10 text-neutral-400'}`}>
                                            {t.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-dark-text-secondary">
                                        <span>{fmtDate(t.event?.start_date)}</span>
                                        {t.event?.venue_name && <span>{t.event.venue_name}</span>}
                                        <span className="font-medium text-neutral-700 dark:text-dark-text">{t.ticket_type}</span>
                                        {t.price > 0 && <span>{t.currency} {Number(t.price).toFixed(2)}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <a
                                        href={t.status === 'confirmed' ? `/tickets/${t.uuid}/download` : '#'}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                            ${t.status === 'confirmed'
                                                ? 'bg-primary-500 text-white hover:bg-primary-400 active:scale-95'
                                                : 'bg-neutral-300 dark:bg-white/[0.05] text-neutral-400 dark:text-dark-text-secondary cursor-not-allowed'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </a>
                                    <span
                                        onClick={t.status === 'confirmed' ? () => router.visit(`/tickets/${t.uuid}`) : undefined}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                            ${t.status === 'confirmed'
                                                ? 'text-neutral-600 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-white/[0.04] active:scale-95 cursor-pointer'
                                                : 'text-neutral-300 dark:text-dark-text-secondary/40 cursor-not-allowed'
                                            }`}
                                    >
                                        View
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No tickets yet</h3>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">Your tickets will appear here once you register for an event.</p>
                    </div>
                )}

                {tickets?.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pb-8">
                        {Array.from({ length: tickets.last_page }, (_, i) => i + 1).map((page) => (
                            <Link key={page} href={`/my-tickets?page=${page}`}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === tickets.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
                            >{page}</Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
