import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard({ stats, customer, events }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Welcome, {auth.user?.name}</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Manage your registrations, tickets, and identity verification.</p>
                </motion.div>

                {!customer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600 dark:text-amber-400"
                    >
                        Complete your profile to register for events.{' '}
                        <Link href={route('profile.edit')} className="font-medium underline hover:no-underline">Update profile</Link>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Upcoming Events', value: stats?.upcoming_events || 0, color: 'text-white', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { label: 'Confirmed Tickets', value: stats?.confirmed_tickets || 0, color: 'text-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'Verification', value: stats?.verification_status === 'verified' ? 'Verified' : stats?.verification_status === 'pending' ? 'Pending' : 'Not Submitted', color: stats?.verification_status === 'verified' ? 'text-green-400' : stats?.verification_status === 'pending' ? 'text-amber-400' : 'text-neutral-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="glass-card p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
                                    <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>



                {events?.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mt-8 mb-3">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Available Events</h2>
                            <Link href="/browse" className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map((ev, i) => (
                                <motion.div key={ev.uuid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                                    <Link href={`/customer/events/${ev.uuid}/register`}
                                        className="glass-card p-4 block hover:border-primary-500/30 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-lg flex-shrink-0">
                                                {ev.event_type === 'virtual' ? '🖥' : ev.event_type === 'physical' ? '📍' : '🏟'}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{ev.title}</h3>
                                                <p className="text-xs text-dark-text-secondary">{ev.venue_name || 'Online'}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-dark-text-secondary">
                                            {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </AppLayout>
    );
}
