import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { StatCard, DoughnutChart, DoughnutLegend, BarChart, LineChart } from '@/Components/Charts';

export default function VerificationReport({ report, filters, events }) {
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [typeFilter, setTypeFilter] = useState(filters.verification_type || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('verification_type', typeFilter);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    window.location.href = `/reports/verification?${params.toString()}`;
  }, [statusFilter, typeFilter, dateFrom, dateTo]);

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
              <span className="text-neutral-500 dark:text-dark-text-secondary">Verification</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Verification Report</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/reports/export/verification/csv${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export CSV</a>
            <a href={`/reports/export/verification/pdf${window.location.search}`} className="btn-secondary h-10 px-4 text-sm">Export PDF</a>
            <button onClick={() => window.print()} className="btn-secondary h-10 px-4 text-sm">Print</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard label="Total" value={s.total_verifications || 0} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="primary" />
          <StatCard label="Verified" value={s.verified || 0} icon="M5 13l4 4L19 7" color="green" />
          <StatCard label="Rejected" value={s.rejected || 0} icon="M6 18L18 6M6 6l12 12" color="primary" />
          <StatCard label="Pending" value={s.pending || 0} icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <StatCard label="In Review" value={s.in_review || 0} icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="blue" />
          <StatCard label="Avg Review" value={s.avg_review_time_hours || 0} suffix="h" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="blue" />
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field px-3 py-2 text-sm">
              <option value="">All Types</option>
              <option value="identity">Identity</option>
              <option value="address">Address</option>
              <option value="document">Document</option>
              <option value="selfie">Selfie</option>
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
                { status: 'Verified', count: s.verified || 0 }, { status: 'Rejected', count: s.rejected || 0 },
                { status: 'Pending', count: s.pending || 0 }, { status: 'In Review', count: s.in_review || 0 },
                { status: 'Flagged', count: s.flagged || 0 },
              ].filter(d => d.count > 0)} nameKey="status" valueKey="count" size={140} innerRadius={0.55} />
              <div className="mt-3 w-full"><DoughnutLegend data={[
                { status: 'Verified', count: s.verified || 0 }, { status: 'Rejected', count: s.rejected || 0 },
                { status: 'Pending', count: s.pending || 0 }, { status: 'In Review', count: s.in_review || 0 },
                { status: 'Flagged', count: s.flagged || 0 },
              ].filter(d => d.count > 0)} nameKey="status" valueKey="count" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Type</h3>
            <BarChart data={report?.by_type || []} xKey="type" valueKey="count" height={140} color="#8B5CF6" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">By Reviewer</h3>
            <div className="space-y-2">
              {(report?.by_reviewer || []).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-white/[0.03]">
                  <span className="text-neutral-700 dark:text-dark-text">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">{r.approved}</span>
                    <span className="text-red-400">{r.rejected}</span>
                    <span className="text-neutral-500">/ {r.count}</span>
                  </div>
                </div>
              ))}
              {(!report?.by_reviewer || report.by_reviewer.length === 0) && <p className="text-xs text-neutral-500 text-center py-4">No data</p>}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Daily Trend</h3>
          <LineChart data={report?.daily_trend || []} xKey="date" series={[{ key: 'count', label: 'Verifications' }]} height={160} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">All Verifications ({report?.verifications?.length || 0})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2 px-2">Customer</th><th className="text-left py-2 px-2">Type</th><th className="text-left py-2 px-2">Status</th><th className="text-left py-2 px-2">Reviewer</th><th className="text-left py-2 px-2">Submitted</th><th className="text-left py-2 px-2">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {(report?.verifications || []).map((v, i) => (
                  <tr key={v.uuid || i} className="border-b border-neutral-100/[0.03] dark:border-white/[0.02] hover:bg-white/[0.02]">
                    <td className="py-2 px-2 text-neutral-700 dark:text-dark-text">{(v.customer?.first_name || '') + ' ' + (v.customer?.last_name || '')}</td>
                    <td className="py-2 px-2 text-neutral-500 capitalize">{v.verification_type?.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-2"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${v.status === 'verified' ? 'bg-green-500/10 text-green-400' : v.status === 'rejected' ? 'bg-red-500/10 text-red-400' : v.status === 'in_review' ? 'bg-blue-500/10 text-blue-400' : v.status === 'flagged' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'}`}>{v.status?.replace(/_/g, ' ')}</span></td>
                    <td className="py-2 px-2 text-neutral-500">{v.reviewer}</td>
                    <td className="py-2 px-2 text-neutral-500">{v.submitted_at ? new Date(v.submitted_at).toLocaleDateString() : ''}</td>
                    <td className="py-2 px-2 text-neutral-500">{v.reviewed_at ? new Date(v.reviewed_at).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
                {(!report?.verifications || report.verifications.length === 0) && <tr><td colSpan={6} className="text-center py-8 text-neutral-500">No verifications found.</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
