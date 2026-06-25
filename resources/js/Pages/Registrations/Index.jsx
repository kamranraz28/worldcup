import { Link } from '@inertiajs/inertia-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function Index({ registrations, filters, stats, events }) {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      window.location.href = `/registrations?${params.toString()}`;
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Registrations</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Manage event registrations and approvals</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/registrations-import" className="btn-secondary h-10 px-4 text-sm">Import</Link>
            <a href="/registrations-export/csv" className="btn-secondary h-10 px-4 text-sm">Export CSV</a>
            <Link href="/registrations/create" className="btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Registration
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats?.total || 0, color: 'text-dark-text' },
            { label: 'Confirmed', value: stats?.confirmed || 0, color: 'text-green-400' },
            { label: 'Pending', value: stats?.pending_approval || 0, color: 'text-amber-400' },
            { label: 'Rejected', value: stats?.rejected || 0, color: 'text-red-400' },
            { label: 'Today', value: stats?.today || 0, color: 'text-blue-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, event..." className="w-full pl-10 pr-4 py-2.5 input-field" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field px-4 py-2.5 w-full sm:w-44">
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="reserved">Reserved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="redeemed">Checked In</option>
            </select>
          </div>
        </motion.div>

        {registrations?.data?.length > 0 ? (
          <div className="space-y-2">
            {registrations.data.map((r, i) => (
              <Link key={r.uuid} href={`/registrations/${r.uuid}`}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/[0.05] transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    r.status === 'confirmed' || r.status === 'redeemed' ? 'bg-green-500/10 text-green-400' :
                    r.status === 'rejected' || r.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {r.ticket_type?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{r.customer?.first_name} {r.customer?.last_name}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">
                      {r.event?.title} · {fmtDate(r.created_at)}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 capitalize">{r.ticket_type}</span>
                  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No registrations found</h3>
            <Link href="/registrations/create" className="mt-4 btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">Create Registration</Link>
          </div>
        )}

        {registrations?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: registrations.last_page }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`/registrations?page=${page}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === registrations.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
