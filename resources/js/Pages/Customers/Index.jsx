import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/UI/StatCard';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function Index({ customers, filters, stats }) {
  const [search, setSearch] = useState(filters.search || '');

  const applyFilters = (params) => {
    router.get('/customers', { ...filters, search, ...params }, { preserveState: true, preserveScroll: true });
  };

  const initials = (c) => ((c.first_name?.charAt(0) || '') + (c.last_name?.charAt(0) || '')).toUpperCase();

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Customers</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
              Manage registered customers
            </p>
          </div>
          <Link
            href={appUrl("/customers/create")}
            className="inline-flex items-center gap-2 btn-primary h-10 px-5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </Link>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Customers" value={stats.total ?? 0} variant="primary" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters({ page: 1 })}
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2.5 input-field"
              />
            </div>
            <button onClick={() => applyFilters({ page: 1 })} className="btn-primary px-5 h-10 text-sm whitespace-nowrap">
              Search
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 dark:text-dark-text-secondary border-b border-neutral-100 dark:border-white/[0.04]">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Nationality</th>
                  <th className="px-5 py-3">Document</th>
                  <th className="px-5 py-3">Registered</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers?.data?.length > 0 ? customers.data.map((customer) => (
                  <tr key={customer.uuid} className="border-b border-neutral-100/60 dark:border-white/[0.03] last:border-0 hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <Link href={appUrl(`/customers/${customer.uuid}`)} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center text-xs font-bold text-primary-400 flex-shrink-0">
                          {initials(customer)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 dark:text-white truncate group-hover:text-primary-400 transition-colors">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-dark-text-secondary truncate">{customer.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-neutral-700 dark:text-dark-text">{customer.phone || '—'}</td>
                    <td className="px-5 py-3 text-neutral-700 dark:text-dark-text">{customer.nationality || '—'}</td>
                    <td className="px-5 py-3">
                      {customer.document_type ? (
                        <div className="min-w-0">
                          <p className="text-neutral-700 dark:text-dark-text capitalize truncate">{customer.document_type.replace('_', ' ')}</p>
                          {customer.document_number && (
                            <p className="text-xs text-neutral-500 dark:text-dark-text-secondary truncate max-w-[160px]">{customer.document_number}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-500 dark:text-dark-text-secondary">{fmtDate(customer.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={appUrl(`/customers/${customer.uuid}`)} className="text-xs font-medium text-primary-400 hover:text-primary-300">View</Link>
                        <Link href={appUrl(`/customers/${customer.uuid}/edit`)} className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-white">Edit</Link>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06] flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No customers found</h3>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-6">
                          {search ? 'Try a different search term' : 'Get started by adding your first customer'}
                        </p>
                        {!search && (
                          <Link
                            href={appUrl("/customers/create")}
                            className="inline-flex items-center gap-2 btn-primary h-10 px-5 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Customer
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {customers?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-4">
            {Array.from({ length: customers.last_page }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => applyFilters({ page })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                  ${page === customers.current_page
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 border border-neutral-200 dark:border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
              >{page}</button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}