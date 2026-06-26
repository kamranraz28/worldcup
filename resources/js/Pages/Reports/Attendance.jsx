import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { StatCard, BarChart, LineChart } from '@/Components/Charts';

export default function AttendanceReport({ report, filters, events }) {
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [validFilter, setValidFilter] = useState(filters.is_valid || '');
  const [methodFilter, setMethodFilter] = useState(filters.scan_method || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (eventFilter) params.set('event_id', eventFilter);
    if (validFilter) params.set('is_valid', validFilter);
    if (methodFilter) params.set('scan_method', methodFilter);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    window.location.href = `/reports/attendance?${params.toString()}`;
  }, [eventFilter, validFilter, methodFilter, dateFrom, dateTo]);

  const s = report?.summary || {};

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
              <span className="text-neutral-500 dark:text-dark-text-secondary">Attendance</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Attendance Report</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/reports/export/attendance/csv${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export CSV</a>
            <a href={`/reports/export/attendance/pdf${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export PDF</a>
            <button onClick={() => window.print()} className="btn-secondary h-10 px-4 text-sm">Print</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard label="Total Scans" value={s.total_scans || 0} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="primary" />
          <StatCard label="Valid" value={s.valid_scans || 0} icon="M5 13l4 4L19 7" color="green" />
          <StatCard label="Invalid" value={s.invalid_scans || 0} icon="M6 18L18 6M6 6l12 12" color="primary" />
          <StatCard label="Rate" value={s.attendance_rate || 0} suffix="%" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" color="blue" />
          <StatCard label="Unique" value={s.unique_customers || 0} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="amber" />
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-3">
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Events</option>
              {events?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <select value={validFilter} onChange={(e) => setValidFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Results</option>
              <option value="1">Valid Only</option>
              <option value="0">Invalid Only</option>
            </select>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Methods</option>
              <option value="qr">QR Scan</option>
              <option value="manual">Manual Entry</option>
              <option value="nfc">NFC</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field px-3 py-2 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Event</h3>
            <div className="space-y-2">
              {(report?.by_event || []).map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-white/[0.03]">
                  <span className="text-neutral-700 dark:text-dark-text">{e.event_title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">{e.valid}</span>
                    <span className="text-red-400">{e.invalid}</span>
                    <span className="text-neutral-500">/ {e.total}</span>
                  </div>
                </div>
              ))}
              {(!report?.by_event || report.by_event.length === 0) && <p className="text-xs text-neutral-500 text-center py-4">No data</p>}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Scan Method</h3>
            <BarChart data={report?.by_method || []} xKey="method" valueKey="count" height={140} color="#3B82F6" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Hourly Distribution</h3>
            <BarChart data={report?.hourly_distribution || []} xKey="hour" valueKey="count" height={140} color="#E30613" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Daily Trend</h3>
            <LineChart data={report?.daily_trend || []} xKey="date" series={[{ key: 'count', label: 'Check-ins' }]} height={140} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">All Check-Ins ({report?.checkins?.length || 0})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2 px-2">Customer</th><th className="text-left py-2 px-2">Event</th><th className="text-left py-2 px-2">Type</th><th className="text-left py-2 px-2">Method</th><th className="text-left py-2 px-2">Status</th><th className="text-left py-2 px-2">Scanner</th><th className="text-left py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {(report?.checkins || []).map((c, i) => (
                  <tr key={c.id || i} className="border-b border-neutral-100/[0.03] dark:border-white/[0.02] hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text">{(c.customer?.first_name || '') + ' ' + (c.customer?.last_name || '')}</td>
                    <td className="py-2 px-2 text-neutral-500">{c.event?.title || ''}</td>
                    <td className="py-2 px-2 text-neutral-500">{c.ticket?.ticket_type || ''}</td>
                    <td className="py-2 px-2 text-neutral-500 uppercase">{c.scan_method}</td>
                    <td className="py-2 px-2"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${c.is_valid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{c.is_valid ? 'Valid' : 'Invalid'}</span></td>
                    <td className="py-2 px-2 text-neutral-500">{c.scanner}</td>
                    <td className="py-2 px-2 text-neutral-500">{c.scanned_at ? new Date(c.scanned_at).toLocaleString() : ''}</td>
                  </tr>
                ))}
                {(!report?.checkins || report.checkins.length === 0) && <tr><td colSpan={7} className="text-center py-8 text-neutral-500">No check-ins found.</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
