import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import EventCover, { eventTypeLabel } from './EventCover';

export function formatEventDate(value) {
    return value
        ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : '';
}

export { eventTypeLabel };

export function formatEventTime(value) {
    return value ? new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
}

/**
 * Card used on the landing page featured strip and the public browse grid.
 * Falls back to themed artwork when an event has no uploaded banner.
 */
export default function PublicEventCard({ event, index = 0, showDescription = true }) {
    const price = Number(event.current_price ?? event.ticket_price ?? 0);
    const isEarly = event.is_early_booking && event.early_booking_price != null;
    const isFull = event.max_capacity != null && event.confirmed_count >= event.max_capacity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
            <Link
                href={appUrl(`/browse/${event.uuid}`)}
                className="group block bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden
                    hover:bg-white/[0.05] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-2xl
                    active:translate-y-0 active:scale-[0.98]
                    transition-all duration-300"
            >
                <div className="aspect-[16/9] bg-white/[0.02] relative overflow-hidden">
                    <EventCover
                        event={event}
                        className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/85 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/80 border border-white/10">
                            {eventTypeLabel(event.event_type)}
                        </span>
                    </div>

                    {isFull && (
                        <div className="absolute top-3 right-3">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">Full</span>
                        </div>
                    )}

                    {isEarly && (
                        <div className="absolute bottom-3 left-3">
                            <span className="text-[10px] font-extrabold tracking-wider px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                                EARLY BIRD
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <h3 className="text-base font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                        {event.title}
                    </h3>

                    {showDescription && event.description && (
                        <p className="text-sm text-white/30 mt-1.5 line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-xs text-white/30">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatEventDate(event.start_date)}</span>
                        <span className="text-white/15">·</span>
                        <span>{formatEventTime(event.start_date)}</span>
                    </div>

                    {event.venue_name && (
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-white/30">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.venue_name}</span>
                        </div>
                    )}

                    <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                        <div>
                            {price > 0 ? (
                                <>
                                    <p className="text-base font-bold text-primary-400">BDT {price.toLocaleString()}</p>
                                    {isEarly && (
                                        <p className="text-[11px] text-white/30 line-through">BDT {Number(event.ticket_price).toLocaleString()}</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-base font-bold text-green-400">Free</p>
                            )}
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 group-hover:text-primary-400 transition-colors">
                            Get Tickets
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
