import { Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { StatCard, LineChart, BarChart, DoughnutChart, DoughnutLegend } from '@/Components/Charts';

export default function ReportsIndex({ analytics, events, recentReports }) {
  const a = analytics || {};
  const at = (v) => a.today_stats?.[v] ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Dashboard overview and report generation</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard label="Registrations Today" value={at('registrations_today')} icon="M12 4v16m8-8H4" color="blue" />
          <StatCard label="Check-Ins Today" value={at('checkins_today')} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="green" />
          <StatCard label="Verifications Today" value={at('verifications_today')} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <StatCard label="Revenue Today" value={at('revenue_today')} suffix={at('revenue_today') > 0 ? ' PKR' : ''} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="green" />
          <StatCard label="Pending Verifications" value={at('pending_verifications')} icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <StatCard label="Upcoming Events" value={at('upcoming_events')} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2 glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Registration Trend ({analytics?.period_days || 30}d)</h3>
            <LineChart data={a.registration_trend || []} xKey="date" series={[{ key: 'count', label: 'Tickets' }]} height={180} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Revenue by Type</h3>
            <div className="flex flex-col items-center">
              <DoughnutChart data={a.revenue_by_type || []} nameKey="type" valueKey="revenue" size={140} innerRadius={0.55} />
              <div className="mt-3 w-full"><DoughnutLegend data={a.revenue_by_type || []} nameKey="type" valueKey="revenue" /></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Attendance Trend</h3>
            <BarChart data={a.attendance_trend || []} xKey="date" valueKey="count" height={140} color="#16A34A" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Top Events by Attendance</h3>
            <div className="space-y-2">
              {(a.top_events || []).slice(0, 5).map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-neutral-500 font-mono">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700 dark:text-dark-text truncate">{e.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded-full bg-green-500/60" style={{ width: Math.min(e.attendance_rate, 100) + '%' }} />
                      </div>
                      <span className="text-[10px] text-neutral-500">{e.attendance_rate}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">{e.redeemed}/{e.confirmed}</span>
                </div>
              ))}
              {(!a.top_events || a.top_events.length === 0) && <p className="text-xs text-neutral-500 text-center py-4">No event data available</p>}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/reports/registration" className="group glass-card p-5 hover:bg-white/[0.06] transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-dark-text group-hover:text-primary-500 transition-colors">Registration Report</h3>
            <p className="text-xs text-neutral-500 mt-1">Tickets by type, status, revenue trends, daily registration metrics</p>
            <span className="text-xs text-primary-500 mt-2 inline-block group-hover:translate-x-1 transition-transform">View →</span>
          </Link>
          <Link href="/reports/attendance" className="group glass-card p-5 hover:bg-white/[0.06] transition-all">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-dark-text group-hover:text-green-400 transition-colors">Attendance Report</h3>
            <p className="text-xs text-neutral-500 mt-1">Check-ins by event, scan method, hourly distribution, daily trends</p>
            <span className="text-xs text-green-400 mt-2 inline-block group-hover:translate-x-1 transition-transform">View →</span>
          </Link>
          <Link href="/reports/verification" className="group glass-card p-5 hover:bg-white/[0.06] transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-dark-text group-hover:text-amber-400 transition-colors">Verification Report</h3>
            <p className="text-xs text-neutral-500 mt-1">Verification funnel, reviewer performance, type breakdown, daily trends</p>
            <span className="text-xs text-amber-400 mt-2 inline-block group-hover:translate-x-1 transition-transform">View →</span>
          </Link>
          <Link href="/reports/scanner" className="group glass-card p-5 hover:bg-white/[0.06] transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-dark-text group-hover:text-blue-400 transition-colors">Scanner Report</h3>
            <p className="text-xs text-neutral-500 mt-1">Scanner staff performance, device stats, scan method breakdown</p>
            <span className="text-xs text-blue-400 mt-2 inline-block group-hover:translate-x-1 transition-transform">View →</span>
          </Link>
        </div>

        {recentReports?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Recently Generated Reports</h3>
            <div className="space-y-1">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-all text-xs">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    r.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                    r.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {r.status === 'completed' ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : '?'}
                  </div>
                  <span className="text-neutral-700 dark:text-dark-text capitalize">{r.name}</span>
                  <span className="text-neutral-500 uppercase">{r.file_type}</span>
                  <span className="text-neutral-400">{r.generator}</span>
                  <span className="text-neutral-400 ml-auto">{r.generated_at ? new Date(r.generated_at).toLocaleString() : ''}</span>
                  {r.file_path && <a href={r.file_path} target="_blank" rel="noopener" className="text-primary-500 hover:text-primary-400 underline underline-offset-2">Download</a>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
