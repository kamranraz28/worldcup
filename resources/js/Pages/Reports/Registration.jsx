import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { StatCard, BarChart, DoughnutChart, DoughnutLegend, LineChart } from '@/Components/Charts';

export default function RegistrationReport({ report, filters, events }) {
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [typeFilter, setTypeFilter] = useState(filters.ticket_type || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (eventFilter) params.set('event_id', eventFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('ticket_type', typeFilter);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    window.location.href = `/reports/registration?${params.toString()}`;
  }, [eventFilter, statusFilter, typeFilter, dateFrom, dateTo]);

  const s = report?.summary || {};
  const currency = s.currency || 'BDT';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm text-neutral-400 mb-2">
              <Link href="/reports" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Reports</Link>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-neutral-500 dark:text-dark-text-secondary">Registration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Registration Report</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/reports/export/registration/csv${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export CSV</a>
            <a href={`/reports/export/registration/pdf${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export PDF</a>
            <button onClick={() => window.print()} className="btn-secondary h-10 px-4 text-sm">Print</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard label="Total Tickets" value={s.total_tickets || 0} icon="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" color="primary" />
          <StatCard label="Revenue" value={s.total_revenue || 0} suffix={` ${currency}`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="green" />
          <StatCard label="Confirmed" value={s.confirmed || 0} icon="M5 13l4 4L19 7" color="green" />
          <StatCard label="Pending" value={s.pending_approval || 0} icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <StatCard label="Redeemed" value={s.redeemed || 0} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="blue" />
          <StatCard label="Rejected" value={s.rejected || 0} icon="M6 18L18 6M6 6l12 12" color="primary" />
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-3">
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Events</option>
              {events?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_approval">Pending</option>
              <option value="redeemed">Redeemed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="reserved">Reserved</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Types</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
              <option value="vvip">VVIP</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field px-3 py-2 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Status</h3>
            <div className="flex flex-col items-center">
              <DoughnutChart data={[
                { status: 'Confirmed', count: s.confirmed || 0 }, { status: 'Pending', count: s.pending_approval || 0 },
                { status: 'Redeemed', count: s.redeemed || 0 }, { status: 'Rejected', count: s.rejected || 0 },
                { status: 'Cancelled', count: s.cancelled || 0 }, { status: 'Reserved', count: s.reserved || 0 },
              ].filter(d => d.count > 0)} nameKey="status" valueKey="count" size={140} innerRadius={0.55} />
              <div className="mt-3 w-full"><DoughnutLegend data={[
                { status: 'Confirmed', count: s.confirmed || 0 }, { status: 'Pending', count: s.pending_approval || 0 },
                { status: 'Redeemed', count: s.redeemed || 0 }, { status: 'Rejected', count: s.rejected || 0 },
                { status: 'Cancelled', count: s.cancelled || 0 }, { status: 'Reserved', count: s.reserved || 0 },
              ].filter(d => d.count > 0)} nameKey="status" valueKey="count" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Type</h3>
            <div className="flex flex-col items-center">
              <DoughnutChart data={report?.by_type || []} nameKey="type" valueKey="count" size={140} innerRadius={0.55} />
              <div className="mt-3 w-full"><DoughnutLegend data={report?.by_type || []} nameKey="type" valueKey="count" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Revenue by Type</h3>
            <div className="space-y-2">
              {(report?.by_type || []).map((t, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 capitalize">{t.type}</span>
                  <span className="text-neutral-700 dark:text-dark-text font-medium">{currency} {Number(t.revenue).toLocaleString()}</span>
                </div>
              ))}
              {(!report?.by_type || report.by_type.length === 0) && <p className="text-xs text-neutral-500 text-center py-4">No data</p>}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Daily Registration Trend</h3>
          <LineChart data={report?.daily_trend || []} xKey="date" series={[{ key: 'count', label: 'Tickets' }, { key: 'revenue', label: 'Revenue' }]} height={180} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">All Tickets ({report?.tickets?.length || 0})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2 px-2">Customer</th><th className="text-left py-2 px-2">Email</th><th className="text-left py-2 px-2">Type</th><th className="text-right py-2 px-2">Price</th><th className="text-left py-2 px-2">Status</th><th className="text-left py-2 px-2">Event</th><th className="text-left py-2 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(report?.tickets || []).map((t, i) => (
                  <tr key={t.uuid || i} className="border-b border-neutral-100/[0.03] dark:border-white/[0.02] hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text">{(t.customer?.first_name || '') + ' ' + (t.customer?.last_name || '')}</td>
                    <td className="py-2 px-2 text-neutral-500">{t.customer?.email || ''}</td>
                    <td className="py-2 px-2 text-neutral-500 capitalize">{t.ticket_type}</td>
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text text-right">{t.currency || currency} {Number(t.price || 0).toFixed(2)}</td>
                    <td className="py-2 px-2"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${t.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : t.status === 'redeemed' ? 'bg-blue-500/10 text-blue-400' : t.status === 'rejected' ? 'bg-red-500/10 text-red-400' : t.status === 'pending_approval' ? 'bg-amber-500/10 text-amber-400' : 'bg-neutral-500/10 text-neutral-400'}`}>{t.status?.replace(/_/g, ' ')}</span></td>
                    <td className="py-2 px-2 text-neutral-500">{t.event?.title || ''}</td>
                    <td className="py-2 px-2 text-neutral-500">{t.registered_at ? new Date(t.registered_at).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
                {(!report?.tickets || report.tickets.length === 0) && <tr><td colSpan={7} className="text-center py-8 text-neutral-500">No tickets found matching filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
