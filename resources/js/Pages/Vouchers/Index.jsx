import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';

const statusStyles = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  used_up: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function Index({ vouchers, filters, stats }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [perPage] = useState(15);

  const applyFilters = (params) => {
    router.get('/vouchers', { ...filters, search, per_page: perPage, ...params }, { preserveState: true, preserveScroll: true });
  };

  const toggleVoucher = (uuid) => router.post(`/vouchers/${uuid}/toggle`, {}, { preserveScroll: true });

  const deleteVoucher = (uuid, code) => {
    if (confirm(`Delete voucher ${code}?`)) {
      router.delete(`/vouchers/${uuid}`, { preserveScroll: true });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Vouchers</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Create discount vouchers for your events</p>
          </div>
          <Link href="/vouchers/create" className="btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Voucher
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active', value: stats?.active || 0, color: 'text-green-400' },
            { label: 'Inactive', value: stats?.inactive || 0, color: 'text-neutral-400' },
            { label: 'Used Up', value: stats?.used_up || 0, color: 'text-amber-400' },
            { label: 'Redemptions', value: stats?.redemptions || 0, color: 'text-primary-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ page: 1 })}
            placeholder="Search code or description..."
            className="input-field flex-1 min-w-[200px]"
          />
          <select value={filters?.status || ''} onChange={(e) => applyFilters({ status: e.target.value, page: 1 })} className="input-field px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="used_up">Used up</option>
            <option value="expired">Expired</option>
          </select>
          <button onClick={() => applyFilters({ page: 1 })} className="btn-primary h-10 px-5 text-sm">Search</button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 dark:text-dark-text-secondary border-b border-neutral-100 dark:border-white/[0.04]">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Discount</th>
                  <th className="px-5 py-3">Usage</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers?.data?.length > 0 ? vouchers.data.map((v) => (
                  <tr key={v.uuid} className="border-b border-neutral-100/60 dark:border-white/[0.03] last:border-0">
                    <td className="px-5 py-3">
                      <span className="font-mono font-semibold text-neutral-900 dark:text-white">{v.code}</span>
                      {v.description && <p className="text-xs text-neutral-500 dark:text-dark-text-secondary truncate max-w-[220px]">{v.description}</p>}
                    </td>
                    <td className="px-5 py-3 text-neutral-700 dark:text-dark-text">{Number(v.discount_percent).toFixed(2)}%</td>
                    <td className="px-5 py-3 text-neutral-700 dark:text-dark-text">{v.used_count} / {v.max_uses}</td>
                    <td className="px-5 py-3 text-xs text-neutral-500 dark:text-dark-text-secondary">
                      {v.starts_at ? `From ${fmtDate(v.starts_at)}` : 'Anytime'}
                      {v.expires_at ? ` • Until ${fmtDate(v.expires_at)}` : ''}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusStyles[v.status] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'}`}>
                        {v.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/vouchers/${v.uuid}/edit`} className="text-xs font-medium text-primary-400 hover:text-primary-300">Edit</Link>
                        <button onClick={() => toggleVoucher(v.uuid)} className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-white">
                          {v.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteVoucher(v.uuid, v.code)} className="text-xs font-medium text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-neutral-500 dark:text-dark-text-secondary">
                      No vouchers yet. Create your first voucher.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {vouchers?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-4">
            {Array.from({ length: vouchers.last_page }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => applyFilters({ page })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === vouchers.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
