import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import EventCover, { eventTypeLabel } from '../../Components/Events/EventCover';
import PublicLayout from '../../Components/Layout/PublicLayout';

export default function EventDetail({ event, isFull, availableSpots }) {
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const handleRegister = () => {
        router.get(appUrl(`/browse/${event.uuid}/register`));
    };

    const bookingClosed = event.registration_deadline ? new Date(event.registration_deadline) < new Date() : false;

    return (
        <PublicLayout>
            <Head title={event?.title ?? 'Event'} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href={appUrl("/browse")} className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to events
                    </Link>

                    <div className="aspect-[21/9] bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden relative mb-8">
                        <EventCover event={event} />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.08] text-white/70 border border-white/[0.06]">
                                    {eventTypeLabel(event.event_type)}
                                </span>
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
                            {event.early_booking_price != null && (
                                <p className="text-xs text-emerald-400 mt-1">
                                    Early booking BDT {Number(event.early_booking_price).toLocaleString()}
                                    {event.early_booking_deadline ? ` until ${fmtDate(event.early_booking_deadline)}` : ''}
                                </p>
                            )}
                            {event.registration_deadline && (
                                <p className="text-xs text-white/40 mt-1">Booking closes {fmtDate(event.registration_deadline)}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {isFull ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">
                                    Event is full
                                </div>
                            ) : bookingClosed ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 text-sm font-medium">
                                    Booking closed
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
