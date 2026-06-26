import { Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

function PublicLayout({ children }) {
    const { auth } = usePage().props;
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-dark-bg via-[#0F0F1A] to-dark-bg overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary-500/[0.06] rounded-full blur-[180px]" />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold-500/[0.04] rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-500/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-2/3 right-1/3 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />

            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div key={i} className="absolute rounded-full bg-white/10"
                    style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ y: [0, -30, 0], opacity: [0, 0.08, 0] }}
                    transition={{ duration: 12 + Math.random() * 15, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 8 }}
                />
            ))}

            <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/35 transition-all duration-300">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">TOFFEE</span>
                        <span className="text-[9px] font-semibold tracking-widest uppercase text-primary-400/80 bg-primary-500/15 px-1.5 py-0.5 rounded ml-2">WC 2026</span>
                    </div>
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/browse" className="px-4 py-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">Events</Link>
                    {auth?.user ? (
                        <Link href={route('customer.dashboard')} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                            My Dashboard
                        </Link>
                    ) : (
                        <Link href={route('login')} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            <main className="relative z-10">{children}</main>
        </div>
    );
}

const eventTypeLabels = {
    live_screening: 'Live Screening',
    viewing_party: 'Viewing Party',
    meet_greet: 'Meet & Greet',
    fan_zone: 'Fan Zone',
    workshop: 'Workshop',
    other: 'Other',
};

export default function Events({ events, filters, eventTypes }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.event_type || '');

    const applyFilters = () => {
        router.get(route('events.public'), { search, event_type: typeFilter }, { preserveState: true, replace: true });
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-white/50 tracking-wide uppercase">FIFA World Cup 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        Upcoming Events
                    </h1>
                    <p className="mt-3 text-lg text-white/30 max-w-2xl mx-auto">
                        Browse and register for live screenings, viewing parties, and fan events.
                    </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder="Search events..."
                            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                        />
                    </div>
                    <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setTimeout(applyFilters, 0); }}
                        className="h-12 px-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="bg-dark-bg">All Types</option>
                        {eventTypes?.map(t => <option key={t} value={t} className="bg-dark-bg">{eventTypeLabels[t] || t}</option>)}
                    </select>
                </div>

                {events?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.data.map((event, i) => (
                            <motion.div key={event.uuid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                <Link href={`/browse/${event.uuid}`}
                                    className="group block bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden
                                        hover:bg-white/[0.05] hover:border-white/[0.1] hover:-translate-y-0.5
                                        active:translate-y-0 active:scale-[0.98]
                                        transition-all duration-300"
                                >
                                    <div className="aspect-[16/9] bg-white/[0.02] relative overflow-hidden">
                                        {event.banner_image ? (
                                            <img src={`/storage/${event.banner_image}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white/5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.08] text-white/70 border border-white/[0.06]">
                                                {eventTypeLabels[event.event_type] || event.event_type}
                                            </span>
                                        </div>
                                        {event.confirmed_count >= event.max_capacity && (
                                            <div className="absolute top-3 right-3">
                                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Full</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{event.title}</h3>
                                        <p className="text-sm text-white/30 mt-1.5 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center gap-3 mt-3 text-xs text-white/20">
                                            <span>{fmtDate(event.start_date)}</span>
                                            {event.venue_name && <span className="truncate">{event.venue_name}</span>}
                                        </div>
                                        {event.ticket_price > 0 && (
                                            <p className="text-sm font-semibold text-primary-400 mt-2">BDT {Number(event.ticket_price).toLocaleString()}</p>
                                        )}
                                        {event.ticket_price == 0 && (
                                            <p className="text-sm font-medium text-green-400 mt-2">Free</p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">No events found</h3>
                        <p className="text-sm text-white/30 mt-1">Check back later for upcoming events.</p>
                    </div>
                )}

                {events?.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        {Array.from({ length: events.last_page }, (_, i) => i + 1).map(page => (
                            <Link key={page} href={`/browse?page=${page}&search=${search}&event_type=${typeFilter}`}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === events.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-white/30 border border-white/[0.08] hover:bg-white/[0.04]'}`}
                            >{page}</Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
