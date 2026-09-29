import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PublicEventCard from '../../Components/Events/PublicEventCard';
import PublicLayout from '../../Components/Layout/PublicLayout';

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

export default function Events({ events, filters, eventTypes }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.event_type || '');

    const applyFilters = () => {
        router.get(appUrl('/browse'), { search, event_type: typeFilter }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head title="Browse Events" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-white/50 tracking-wide uppercase">TicketClub</span>
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
                            <PublicEventCard key={event.uuid} event={event} index={i} />
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
                            <Link key={page} href={appUrl(`/browse?page=${page}&search=${search}&event_type=${typeFilter}`)}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === events.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-white/30 border border-white/[0.08] hover:bg-white/[0.04]'}`}
                            >{page}</Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
