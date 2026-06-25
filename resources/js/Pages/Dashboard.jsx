import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/Dashboard/StatCard';
import AreaChart from '@/Components/Dashboard/AreaChart';
import DoughnutChart, { DoughnutLegend } from '@/Components/Dashboard/DoughnutChart';
import BarChart from '@/Components/Dashboard/BarChart';
import ActivityFeed from '@/Components/Dashboard/ActivityFeed';
import UpcomingEvents from '@/Components/Dashboard/UpcomingEvents';
import QuickActions from '@/Components/Dashboard/QuickActions';
import { CardSkeleton, ChartSkeleton, ListSkeleton } from '@/Components/Dashboard/Skeleton';

const statIcons = {
    events: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    tickets: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    checkin: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    capacity: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
};

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

export default function Dashboard({ stats, chartData, recentActivity, upcomingEvents, pendingVerifications }) {
    const { auth } = usePage().props;
    const [loaded] = useState(true);
    const [greeting] = useState(() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
                {/* Header — Glass greeting */}
                <motion.div variants={fadeUp}
                    className="relative overflow-hidden glass-card-premium p-6 lg:p-8"
                >
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-primary-500/15 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-gold-500/10 to-transparent rounded-full blur-2xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5 mb-2">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
                                >
                                    {greeting}, {auth.user?.name?.split(' ')[0] || 'there'}
                                </motion.h1>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                                    className="text-2xl">👋</motion.span>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">
                                {dateStr} &middot; Welcome to the Toffee World Cup HQ
                            </p>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-6">
                            {[
                                { label: 'Total Events', value: stats?.activeEvents?.value || 0 },
                                { label: 'Fans Registered', value: auth.user?.id ? '10k+' : '\u2014' },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{s.value}</p>
                                    <p className="text-[11px] text-neutral-400 dark:text-dark-text-secondary">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                {loaded ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Active Events" value={stats?.activeEvents?.value ?? 0} change={stats?.activeEvents?.change} direction={stats?.activeEvents?.direction} icon={statIcons.events} color="primary" />
                        <StatCard label="Tickets Sold" value={stats?.ticketsSold?.value ?? 0} change={stats?.ticketsSold?.change} direction={stats?.ticketsSold?.direction} icon={statIcons.tickets} color="green" />
                        <StatCard label="Check-ins Today" value={stats?.checkinsToday?.value ?? 0} change={stats?.checkinsToday?.change} direction={stats?.checkinsToday?.direction} icon={statIcons.checkin} color="blue" />
                        <StatCard label="Capacity Utilized" value={stats?.capacityUtilized?.value ?? 0} change={stats?.capacityUtilized?.change} direction={stats?.capacityUtilized?.direction} suffix={stats?.capacityUtilized?.suffix ?? '%'} icon={statIcons.capacity} color="amber" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
                    </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <motion.div variants={fadeUp} className="lg:col-span-3 glass-card-premium p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Registration Trends</h2>
                                <p className="text-xs text-neutral-400 dark:text-dark-text-secondary mt-0.5">Daily sign-ups and verifications</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-dark-text-secondary">
                                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                                    Registrations
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-dark-text-secondary">
                                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                                    Verifications
                                </span>
                            </div>
                        </div>

                        {chartData?.registrationTrend ? (
                            <div className="h-[220px]">
                                <AreaChart data={chartData.registrationTrend} xKey="date" series={[{ key: 'registrations', label: 'Registrations' }, { key: 'verifications', label: 'Verifications' }]} height={220} />
                            </div>
                        ) : (
                            <ChartSkeleton height="h-[220px]" />
                        )}
                    </motion.div>

                    <motion.div variants={fadeUp} className="lg:col-span-2 glass-card-premium p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Ticket Sales</h2>
                                <p className="text-xs text-neutral-400 dark:text-dark-text-secondary mt-0.5">By ticket type</p>
                            </div>
                        </div>

                        {chartData?.ticketSalesByType && chartData.ticketSalesByType.length > 0 ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <DoughnutChart data={chartData.ticketSalesByType} nameKey="type" valueKey="count" size={160} innerRadius={0.65} />
                                <div className="flex-1 w-full">
                                    <DoughnutLegend data={chartData.ticketSalesByType} nameKey="type" valueKey="count" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[180px]">
                                <p className="text-xs text-neutral-400">No ticket sales data</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Middle Row — Activity + Quick Actions + Verifications */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <motion.div variants={fadeUp} className="lg:col-span-2 glass-card-premium p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Activity</h2>
                            <button className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors">View all</button>
                        </div>

                        {recentActivity && recentActivity.length > 0 ? (
                            <ActivityFeed activities={recentActivity} />
                        ) : (
                            <ListSkeleton rows={5} />
                        )}
                    </motion.div>

                    <motion.div variants={fadeUp} className="lg:col-span-2 space-y-5">
                        <div className="glass-card-premium p-5 lg:p-6">
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h2>
                            <QuickActions />
                        </div>

                        <div className="glass-card-premium p-5 lg:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Pending Verifications</h2>
                                <span className="text-xs font-medium text-primary-500 hover:text-primary-400 cursor-pointer transition-colors">View all</span>
                            </div>

                            {pendingVerifications && pendingVerifications.length > 0 ? (
                                <div className="space-y-2">
                                    {pendingVerifications.map((v) => (
                                        <div key={v.id}
                                            className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/[0.03] border border-amber-100/50 dark:border-amber-500/10
                                                hover:bg-amber-50 dark:hover:bg-amber-500/[0.05] transition-colors cursor-pointer">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{v.customer_name}</p>
                                                <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">{v.verification_type} &middot; {v.submitted_at}</p>
                                            </div>
                                            <span className="badge-sm bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex-shrink-0">Pending</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-neutral-400 dark:text-dark-text-secondary py-6 text-center">All verifications up to date</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Row — Upcoming Events + Weekly Check-ins */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <motion.div variants={fadeUp} className="lg:col-span-3 glass-card-premium p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Events</h2>
                            <button className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors">View calendar</button>
                        </div>
                        <UpcomingEvents events={upcomingEvents} />
                    </motion.div>

                    <motion.div variants={fadeUp} className="lg:col-span-2 glass-card-premium p-5 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Weekly Check-ins</h2>
                                <p className="text-xs text-neutral-400 dark:text-dark-text-secondary mt-0.5">Last 7 days</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                12%
                            </div>
                        </div>

                        <div className="h-[160px]">
                            {chartData?.weeklyCheckins ? (
                                <BarChart data={chartData.weeklyCheckins} xKey="day" valueKey="checkins" height={160} color="#E30613" />
                            ) : (
                                <ChartSkeleton height="h-[160px]" />
                            )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/[0.04]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-400 dark:text-dark-text-secondary">Total this week</span>
                                <span className="font-semibold text-neutral-900 dark:text-white">{chartData?.weeklyCheckins?.reduce((s, d) => s + d.checkins, 0).toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
