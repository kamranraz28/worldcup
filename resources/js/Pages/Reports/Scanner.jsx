import { Link } from '@inertiajs/inertia-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { StatCard, BarChart, LineChart } from '@/Components/Charts';

export default function ScannerReport({ report, filters, events }) {
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (eventFilter) params.set('event_id', eventFilter);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    window.location.href = `/reports/scanner?${params.toString()}`;
  }, [eventFilter, dateFrom, dateTo]);

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
              <span className="text-neutral-500 dark:text-dark-text-secondary">Scanner</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Scanner Report</h1>
            <p className="text-xs text-neutral-500 mt-1">{s.period}</p>
          </div>
          <div className="flex gap-2">
            <a href={`/reports/export/scanner/csv${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export CSV</a>
            <a href={`/reports/export/scanner/pdf${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export PDF</a>
            <button onClick={() => window.print()} className="btn-secondary h-10 px-4 text-sm">Print</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard label="Total Scans" value={s.total_scans || 0} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="primary" />
          <StatCard label="Active Scanners" value={s.active_scanners || 0} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="blue" />
          <StatCard label="Devices" value={s.unique_devices || 0} icon="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" color="amber" />
          <StatCard label="QR Scans" value={s.qr_scans || 0} icon="M12 4v16m8-8H4" color="green" />
          <StatCard label="Manual" value={s.manual_scans || 0} icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" color="primary" />
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-3">
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Events</option>
              {events?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field px-3 py-2 text-sm" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Scanner Staff Performance</h3>
            <div className="space-y-2">
              {(report?.by_scanner || []).map((sc, i) => {
                const max = Math.max(...(report?.by_scanner || []).map(s => s.total_scans), 1);
                return (
                  <div key={i} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-neutral-700 dark:text-dark-text">{sc.name}</span>
                      <div className="flex items-center gap-2 text-neutral-500">
                        <span className="text-green-400">{sc.valid_scans}</span>
                        <span className="text-red-400">{sc.invalid_scans}</span>
                        <span className="text-neutral-700 dark:text-dark-text font-medium">{sc.total_scans}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500/60" style={{ width: (sc.total_scans / max) * 100 + '%' }} />
                    </div>
                  </div>
                );
              })}
              {(!report?.by_scanner || report.by_scanner.length === 0) && <p className="text-xs text-neutral-500 text-center py-4">No scanner data</p>}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Device</h3>
            <BarChart data={report?.by_device || []} xKey="device" valueKey="count" height={140} color="#8B5CF6" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Daily Scan Trend</h3>
          <LineChart data={report?.daily_trend || []} xKey="date" series={[{ key: 'count', label: 'Scans' }]} height={160} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Scanner Staff Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2 px-2">Scanner</th><th className="text-right py-2 px-2">Total</th><th className="text-right py-2 px-2">Valid</th><th className="text-right py-2 px-2">Invalid</th><th className="text-right py-2 px-2">QR</th><th className="text-right py-2 px-2">Manual</th><th className="text-right py-2 px-2">Events</th><th className="text-right py-2 px-2">Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {(report?.by_scanner || []).map((sc, i) => (
                  <tr key={i} className="border-b border-neutral-100/[0.03] dark:border-white/[0.02] hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text">{sc.name}</td>
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text text-right">{sc.total_scans}</td>
                    <td className="py-2 px-2 text-green-400 text-right">{sc.valid_scans}</td>
                    <td className="py-2 px-2 text-red-400 text-right">{sc.invalid_scans}</td>
                    <td className="py-2 px-2 text-neutral-500 text-right">{sc.qr_scans}</td>
                    <td className="py-2 px-2 text-neutral-500 text-right">{sc.manual_scans}</td>
                    <td className="py-2 px-2 text-neutral-500 text-right">{sc.unique_events}</td>
                    <td className="py-2 px-2 text-neutral-500 text-right">{sc.last_scan_at ? new Date(sc.last_scan_at).toLocaleString() : ''}</td>
                  </tr>
                ))}
                {(!report?.by_scanner || report.by_scanner.length === 0) && <tr><td colSpan={8} className="text-center py-8 text-neutral-500">No scanner data found.</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
