import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PublicEventCard from '../../Components/Events/PublicEventCard';
import PublicLayout from '../../Components/Layout/PublicLayout';

const easeOut = [0.22, 1, 0.36, 1];

const eventTypeLabels = {
    live_screening: 'Live Screening',
    viewing_party: 'Viewing Party',
    meet_greet: 'Meet & Greet',
    fan_zone: 'Fan Zone',
    workshop: 'Workshop',
    other: 'Other',
    live: 'Live',
    virtual: 'Virtual',
    hybrid: 'Hybrid',
};

const QUICK_CHIPS = [
    { label: 'All Events', value: '', icon: '🎟️', classes: 'from-primary-500 to-rose-500' },
    { label: 'Live', value: 'live', icon: '🎤', classes: 'from-gold-400 to-amber-500' },
    { label: 'Virtual', value: 'virtual', icon: '💻', classes: 'from-blue-400 to-cyan-400' },
    { label: 'Hybrid', value: 'hybrid', icon: '🌐', classes: 'from-green-400 to-emerald-500' },
];

export default function Events({ events, filters, eventTypes }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.event_type || '');

    const applyFilters = (overrides = {}) => {
        router.get(appUrl('/browse'), { search, event_type: typeFilter, ...overrides }, { preserveState: true, replace: true });
    };

    const pickType = (value) => {
        setTypeFilter(value);
        applyFilters({ event_type: value, page: 1 });
    };

    return (
        <PublicLayout>
            <Head title="Browse Events" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
                        className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-2 backdrop-blur"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-400" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600 dark:text-white/60">Discover events</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
                    >
                        Find your next{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-gold-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                            experience
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-white/40 sm:text-lg"
                    >
                        Live screenings, virtual talks, hybrid meetups and more. Pick a category or search — then book in seconds.
                    </motion.p>
                </motion.div>

                {/* Quick category chips */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
                    className="mb-8 flex flex-wrap items-center justify-center gap-3"
                >
                    {QUICK_CHIPS.map((c) => {
                        const active = typeFilter === c.value;
                        return (
                            <button
                                key={c.value}
                                onClick={() => pickType(c.value)}
                                className={`group inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                                    active
                                        ? 'border-white/20 bg-white dark:bg-white/[0.08] text-neutral-900 dark:text-white shadow-lg'
                                        : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-neutral-600 dark:text-white/60 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${c.classes} text-sm shadow`}>
                                    {c.icon}
                                </span>
                                {c.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5, ease: easeOut }}
                    className="mb-10 rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4 backdrop-blur"
                >
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters({ page: 1 })}
                                placeholder="Search events by name or venue..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => pickType(e.target.value)}
                            className="h-12 px-4 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm text-neutral-700 dark:text-white/70 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-neutral-50 dark:bg-dark-bg">All types</option>
                            {eventTypes?.map((t) => (
                                <option key={t} value={t} className="bg-neutral-50 dark:bg-dark-bg">{eventTypeLabels[t] || t}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => applyFilters({ page: 1 })}
                            className="btn-primary h-12 px-6 text-sm whitespace-nowrap"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </div>
                </motion.div>

                {/* Result count */}
                {events?.data?.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-white/30"
                    >
                        {events.total} event{events.total === 1 ? '' : 's'} found
                    </motion.p>
                )}

                {/* Grid */}
                {events?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.data.map((event, i) => (
                            <PublicEventCard key={event.uuid} event={event} index={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/40 to-gold-400/40 blur-xl" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                                <svg className="h-8 w-8 text-neutral-500 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No events found</h3>
                        <p className="mt-1 max-w-sm text-sm text-neutral-400 dark:text-white/30">
                            {search || typeFilter
                                ? 'Try a different search term or clear the filters.'
                                : 'New events are being added all the time — check back soon.'}
                        </p>
                        {(search || typeFilter) && (
                            <button
                                onClick={() => { setSearch(''); setTypeFilter(''); applyFilters({ search: '', event_type: '', page: 1 }); }}
                                className="btn-secondary mt-6 px-6 py-2.5 text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Pagination */}
                {events?.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {Array.from({ length: events.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={appUrl(`/browse?page=${page}&search=${encodeURIComponent(search)}&event_type=${typeFilter}`)}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                                    page === events.current_page
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-glow-primary'
                                        : 'border border-neutral-200 dark:border-white/[0.08] text-neutral-400 dark:text-white/35 hover:bg-neutral-100 dark:hover:bg-white/[0.04] hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >{page}</Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}