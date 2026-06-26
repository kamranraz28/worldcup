import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function Index({ verifications, filters, stats }) {
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      router.get(`/verifications?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, typeFilter]);

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Verifications</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Review and manage identity verifications</p>
          </div>
          <Link href="/verifications-review" className="btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Pending Review
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Pending', value: stats?.by_status?.pending || 0, color: 'text-amber-400' },
            { label: 'In Review', value: stats?.by_status?.in_review || 0, color: 'text-blue-400' },
            { label: 'Verified', value: stats?.by_status?.verified || 0, color: 'text-green-400' },
            { label: 'Rejected', value: stats?.by_status?.rejected || 0, color: 'text-red-400' },
            { label: 'Flagged', value: stats?.by_status?.flagged || 0, color: 'text-purple-400' },
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
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer name/email..." className="w-full pl-10 pr-4 py-2.5 input-field" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field px-4 py-2.5 w-full sm:w-40">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field px-4 py-2.5 w-full sm:w-44">
              <option value="">All Types</option>
              <option value="identity">Identity</option>
              <option value="address">Address</option>
              <option value="age">Age</option>
              <option value="ticket_eligibility">Ticket Eligibility</option>
            </select>
          </div>
        </motion.div>

        {verifications?.data?.length > 0 ? (
          <div className="space-y-2">
            {verifications.data.map((v, i) => (
              <Link key={v.uuid} href={`/verifications/${v.uuid}`}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/[0.05] transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    v.status === 'verified' ? 'bg-green-500/10 text-green-400' :
                    v.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                    v.status === 'flagged' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {v.verification_type?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-700 dark:text-dark-text capitalize truncate">{v.verification_type} Verification</p>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">
                      {v.customer?.first_name} {v.customer?.last_name} · {fmtDate(v.created_at)}
                    </p>
                  </div>
                  {v.reviewer && <span className="text-xs text-neutral-500">by {v.reviewer.name}</span>}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No verifications found</h3>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">Verifications appear once customers submit documents.</p>
          </div>
        )}

        {verifications?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: verifications.last_page }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`/verifications?page=${page}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === verifications.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
