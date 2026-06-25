import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const typeIcons = {
    physical: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    virtual: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    hybrid: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
};

export default function UpcomingEvents({ events }) {
    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-dark-muted border border-neutral-200 dark:border-dark-border flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">No upcoming events</p>
                <p className="text-xs text-neutral-400 mt-1">Events will appear here once published.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {events.map((event, i) => (
                <motion.div
                    key={event.uuid || event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                    <Link
                        href={`/events/${event.uuid || event.id}`}
                        className="group block card-premium-hover p-4"
                    >
                        <div className="flex items-start gap-3">
                            {/* Date badge */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/5
                                dark:from-primary-500/20 dark:to-primary-500/5
                                flex flex-col items-center justify-center leading-none
                                group-hover:from-primary-500/20 group-hover:to-primary-600/10 transition-all duration-300">
                                {event.start_date && (
                                    <>
                                        <span className="text-[10px] font-semibold text-primary-500 dark:text-primary-400 uppercase">
                                            {new Date(event.start_date).toLocaleDateString('en', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-bold text-primary-600 dark:text-primary-300 -mt-0.5">
                                            {new Date(event.start_date).getDate()}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                                        {event.title}
                                    </h3>
                                    {event.event_type && (
                                        <span className="text-[10px] font-medium text-neutral-400 dark:text-dark-text-secondary 
                                            bg-neutral-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded flex-shrink-0">
                                            {event.event_type}
                                        </span>
                                    )}
                                </div>
                                {event.venue_name && (
                                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary truncate flex items-center gap-1 mt-0.5">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.venue_name}
                                    </p>
                                )}

                                {/* Progress bar */}
                                {event.max_capacity > 0 && (
                                    <div className="mt-2.5 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(event.fill_percent || 0, 100)}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                            />
                                        </div>
                                        <span className={`text-[11px] font-medium tabular-nums
                                            ${(event.fill_percent || 0) >= 80
                                                ? 'text-green-600 dark:text-green-400'
                                                : (event.fill_percent || 0) >= 50
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : 'text-neutral-400 dark:text-dark-text-secondary'
                                            }`}>
                                            {event.confirmed_count || 0}/{event.max_capacity}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <svg className="w-4 h-4 text-neutral-300 dark:text-dark-border mt-1 
                                group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
