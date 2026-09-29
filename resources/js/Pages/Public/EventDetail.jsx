import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import EventCover, { eventTypeLabel } from '../../Components/Events/EventCover';
import PublicLayout from '../../Components/Layout/PublicLayout';

const easeOut = [0.22, 1, 0.36, 1];

const INFO_META = [
    { key: 'date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', tint: 'text-primary-400' },
    { key: 'time', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', tint: 'text-gold-400' },
    { key: 'venue', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', tint: 'text-blue-400' },
    { key: 'capacity', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', tint: 'text-green-400' },
];

export default function EventDetail({ event, isFull, availableSpots }) {
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const handleRegister = () => {
        router.get(appUrl(`/browse/${event.uuid}/register`));
    };

    const bookingClosed = event.registration_deadline ? new Date(event.registration_deadline) < new Date() : false;

    const infoCards = [
        { label: 'Date', value: fmtDate(event.start_date), icon: INFO_META[0].icon, tint: INFO_META[0].tint },
        { label: 'Time', value: `${fmtTime(event.start_date)} - ${fmtTime(event.end_date)}`, icon: INFO_META[1].icon, tint: INFO_META[1].tint },
        { label: 'Venue', value: event.venue_name || '—', icon: INFO_META[2].icon, tint: INFO_META[2].tint },
        { label: 'Capacity', value: isFull ? 'Full' : `${availableSpots} spots left`, icon: INFO_META[3].icon, tint: INFO_META[3].tint, highlight: isFull },
    ];

    return (
        <PublicLayout>
            <Head title={event?.title ?? 'Event'} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }}>
                    <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                        <Link href={appUrl('/browse')} className="group mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-white/40 transition-colors hover:text-neutral-900 dark:hover:text-white/70">
                            <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to events
                        </Link>
                    </motion.div>

                    {/* Cover */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.12, duration: 0.6, ease: easeOut }}
                        className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/[0.07]"
                    >
                        <EventCover event={event} />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 dark:bg-dark-bg/60 px-3.5 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                                {eventTypeLabel(event.event_type)}
                            </span>
                            <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">{event.title}</h1>
                        </div>
                    </motion.div>

                    {/* Info cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
                        className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                        {infoCards.map((info) => (
                            <div key={info.label} className="group rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-white/15">
                                <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-white/[0.04] transition-transform duration-300 group-hover:scale-110 ${info.tint}`}>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={info.icon} />
                                    </svg>
                                </span>
                                <p className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-white/30">{info.label}</p>
                                <p className={`mt-0.5 text-sm font-medium ${info.highlight ? 'text-amber-400' : 'text-neutral-800 dark:text-white/80'}`}>{info.value}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Price + CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.6, ease: easeOut }}
                        className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-5 backdrop-blur"
                    >
                        <div>
                            {event.ticket_price > 0 ? (
                                <p className="bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-3xl font-extrabold text-transparent">
                                    BDT {Number(event.ticket_price).toLocaleString()}
                                </p>
                            ) : (
                                <p className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-3xl font-extrabold text-transparent">Free</p>
                            )}
                            {event.early_booking_price != null && (
                                <p className="mt-1 text-xs text-emerald-400">
                                    Early booking BDT {Number(event.early_booking_price).toLocaleString()}
                                    {event.early_booking_deadline ? ` until ${fmtDate(event.early_booking_deadline)}` : ''}
                                </p>
                            )}
                            {event.registration_deadline && (
                                <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">Booking closes {fmtDate(event.registration_deadline)}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {isFull ? (
                                <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-3 text-sm font-medium text-amber-400">Event is full</div>
                            ) : bookingClosed ? (
                                <div className="inline-flex items-center gap-2 rounded-2xl border border-neutral-500/20 bg-neutral-500/10 px-6 py-3 text-sm font-medium text-neutral-400">Booking closed</div>
                            ) : (
                                <motion.button whileTap={{ scale: 0.97 }} onClick={handleRegister}
                                    className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2 shadow-glow-primary">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                    Register Now
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* About */}
                    {event.description && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut }}
                            className="mb-8"
                        >
                            <h2 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-white/80">About this event</h2>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-500 dark:text-white/40">{event.description}</p>
                        </motion.div>
                    )}

                    {event.venue_address && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut }}
                            className="mb-8"
                        >
                            <h2 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-white/80">Location</h2>
                            <p className="text-sm text-neutral-500 dark:text-white/40">{event.venue_address}</p>
                        </motion.div>
                    )}

                    {event.sessions?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: easeOut }}
                        >
                            <h2 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-white/80">Sessions</h2>
                            <div className="space-y-2">
                                {event.sessions.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-800 dark:text-white/80">{s.title}</p>
                                            <p className="text-xs text-neutral-400 dark:text-white/30">{s.location} • {fmtTime(s.start_time)} - {fmtTime(s.end_time)}</p>
                                        </div>
                                        <span className="rounded-full bg-white dark:bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-white/40">Session</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </PublicLayout>
    );
}