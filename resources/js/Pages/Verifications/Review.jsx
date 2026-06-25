import { Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function Review({ verifications, filters, stats }) {
  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/verifications" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Verifications</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Pending Review</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Pending Review</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Verifications requiring your attention</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Requiring Attention', value: stats?.by_status?.flagged || 0, color: 'text-red-400' },
            { label: 'Today', value: stats?.total_today || 0, color: 'text-amber-400' },
            { label: 'Approved Today', value: stats?.approved_today || 0, color: 'text-green-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {verifications?.data?.length > 0 ? (
          <div className="space-y-2">
            {verifications.data.map((v, i) => (
              <Link key={v.uuid} href={`/verifications/${v.uuid}`}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    v.status === 'flagged' ? 'border-purple-500/20 bg-purple-500/[0.02] hover:bg-purple-500/[0.05]' :
                    'glass-card hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    v.status === 'flagged' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {v.verification_type?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-700 dark:text-dark-text capitalize truncate">{v.verification_type}</p>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">
                      {v.customer?.first_name} {v.customer?.last_name} · {new Date(v.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {v.status === 'flagged' && <span className="text-xs text-purple-400 font-medium">Needs review</span>}
                  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/[0.03] border border-green-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">All caught up!</h3>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">No pending verifications requiring review.</p>
          </div>
        )}

        {verifications?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: verifications.last_page }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`/verifications-review?page=${page}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === verifications.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
