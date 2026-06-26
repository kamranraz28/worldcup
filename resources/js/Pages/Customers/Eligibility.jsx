import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Eligibility({ customer, checks, duplicates }) {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/customers" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Customers</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/customers/${customer.uuid}`} className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">{customer.first_name} {customer.last_name}</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Eligibility</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Eligibility Check</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">{customer.first_name} {customer.last_name}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Verification Checks</h2>
          <div className="space-y-4">
            {checks.map((check, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  check.passed ? 'border-green-500/20 bg-green-500/[0.02]' : 'border-red-500/20 bg-red-500/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  check.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {check.passed ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium capitalize ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {check.check.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">{check.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {duplicates?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.02] to-transparent"
          >
            <h2 className="text-lg font-semibold text-amber-400 mb-4">Potential Duplicates</h2>
            <div className="space-y-2">
              {duplicates.map((dup) => (
                <Link key={dup.uuid} href={`/customers/${dup.uuid}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-amber-500/10 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all"
                >
                  <span className="text-sm text-neutral-700 dark:text-dark-text">{dup.first_name} {dup.last_name}</span>
                  <span className="text-xs text-neutral-500 dark:text-dark-text-secondary">{dup.email}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex justify-center pb-8">
          <Link href={`/customers/${customer.uuid}`} className="btn-primary h-10 px-6 text-sm">Back to Customer</Link>
        </div>
      </div>
    </AppLayout>
  );
}
