import { Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

function PublicLayout({ children }) {
    const { auth } = usePage().props;
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-dark-bg via-[#0F0F1A] to-dark-bg overflow-hidden">
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
                        <Link href={route('customer.dashboard')} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">My Dashboard</Link>
                    ) : (
                        <Link href={route('login')} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">Sign In</Link>
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

export default function EventDetail({ event, isFull, availableSpots, userRegistered }) {
    const { auth } = usePage().props;
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const handleRegister = () => {
        if (!auth?.user) {
            router.get(route('login'));
        } else {
            router.get(route('customer.events.register', event.uuid));
        }
    };

    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to events
                    </Link>

                    <div className="aspect-[21/9] bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden relative mb-8">
                        {event.banner_image ? (
                            <img src={`/storage/${event.banner_image}`} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-24 h-24 text-white/5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.08] text-white/70 border border-white/[0.06]">
                                    {eventTypeLabels[event.event_type] || event.event_type}
                                </span>
                                {event.requires_verification && (
                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        Verification Required
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">{event.title}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Date', value: fmtDate(event.start_date) },
                            { label: 'Time', value: `${fmtTime(event.start_date)} - ${fmtTime(event.end_date)}` },
                            { label: 'Venue', value: event.venue_name || '—' },
                            { label: 'Capacity', value: isFull ? 'Full' : `${availableSpots} spots left`, highlight: isFull },
                        ].map((info) => (
                            <div key={info.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                <p className="text-xs text-white/30">{info.label}</p>
                                <p className={`text-sm font-medium mt-0.5 ${info.highlight ? 'text-amber-400' : 'text-white/80'}`}>{info.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                        <div>
                            {event.ticket_price > 0 ? (
                                <p className="text-2xl font-bold text-primary-400">BDT {Number(event.ticket_price).toLocaleString()}</p>
                            ) : (
                                <p className="text-2xl font-bold text-green-400">Free</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {userRegistered ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    You're registered!
                                </div>
                            ) : isFull ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">
                                    Event is full
                                </div>
                            ) : (
                                <button onClick={handleRegister}
                                    className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                    Register Now
                                </button>
                            )}
                        </div>
                    </div>

                    {event.description && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-white/80 mb-3">About this event</h2>
                            <p className="text-sm text-white/40 leading-relaxed whitespace-pre-line">{event.description}</p>
                        </div>
                    )}

                    {event.venue_address && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-white/80 mb-3">Location</h2>
                            <p className="text-sm text-white/40">{event.venue_address}</p>
                        </div>
                    )}

                    {event.sessions?.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-white/80 mb-3">Sessions</h2>
                            <div className="space-y-2">
                                {event.sessions.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                        <div>
                                            <p className="text-sm font-medium text-white/80">{s.title}</p>
                                            <p className="text-xs text-white/30">{s.location} • {fmtTime(s.start_time)} - {fmtTime(s.end_time)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </PublicLayout>
    );
}
