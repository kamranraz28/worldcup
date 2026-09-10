import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Events({ events }) {
    return (
        <AppLayout>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Available Events</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Browse open events and book your ticket.</p>
                </motion.div>

                {events?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((ev, i) => (
                            <motion.div key={ev.uuid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                <Link href={`/customer/events/${ev.uuid}/register`}
                                    className="glass-card p-4 block hover:border-primary-500/30 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-lg flex-shrink-0">
                                            {ev.event_type === 'virtual' ? '🖥' : ev.event_type === 'hybrid' ? '🔄' : '🏟'}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{ev.title}</h3>
                                            <p className="text-xs text-dark-text-secondary">{ev.venue_name || 'Online'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs text-dark-text-secondary">
                                            {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <span className="text-xs font-semibold text-primary-500">
                                            {ev.ticket_price > 0 ? `BDT ${Number(ev.ticket_price).toFixed(2)}` : 'Free'}
                                        </span>
                                    </div>
                                    <button type="button" className="btn-primary h-9 w-full mt-3 text-sm inline-flex items-center justify-center">
                                        Register
                                    </button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">No events are open for registration right now.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
