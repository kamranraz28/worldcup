import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';

export default function Index({ scanners, filters, stats }) {
  const [search, setSearch] = useState(filters?.search || '');

  const applyFilters = (params) => {
    router.get('/scanners', { ...filters, search, ...params }, { preserveState: true, preserveScroll: true });
  };

  const toggleScanner = (uuid) => router.post(`/scanners/${uuid}/toggle`, {}, { preserveScroll: true });
  const deleteScanner = (uuid, name) => {
    if (confirm(`Delete scanner ${name}?`)) {
      router.delete(`/scanners/${uuid}`, { preserveScroll: true });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Scanners</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Create scanner accounts and assign them to events</p>
          </div>
          <Link href="/scanners/create" className="btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Scanner
          </Link>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: stats?.total || 0, color: 'text-white' },
            { label: 'Active', value: stats?.active || 0, color: 'text-green-400' },
            { label: 'Inactive', value: stats?.inactive || 0, color: 'text-neutral-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-4 flex flex-wrap items-center gap-2">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFilters({ page: 1 })}
            placeholder="Search name, email or phone..." className="input-field flex-1 min-w-[200px]" />
          <select value={filters?.status || ''} onChange={(e) => applyFilters({ status: e.target.value, page: 1 })} className="input-field px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={() => applyFilters({ page: 1 })} className="btn-primary h-10 px-5 text-sm">Search</button>
        </div>

        <div className="space-y-3">
          {scanners?.data?.length > 0 ? scanners.data.map((s, i) => (
            <motion.div key={s.uuid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white truncate">{s.name}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'}`}>
                    {s.is_active ? 'active' : 'inactive'}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary truncate">{s.email}{s.phone ? ` • ${s.phone}` : ''}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {s.events?.length > 0 ? s.events.map((e) => (
                    <span key={e.uuid} className="text-[11px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">{e.title}</span>
                  )) : (
                    <span className="text-[11px] text-amber-400">No events assigned</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link href={`/scanners/${s.uuid}/edit`} className="text-xs font-medium text-primary-400 hover:text-primary-300">Edit</Link>
                <button onClick={() => toggleScanner(s.uuid)} className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-white">
                  {s.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteScanner(s.uuid, s.name)} className="text-xs font-medium text-red-400 hover:text-red-300">Delete</button>
              </div>
            </motion.div>
          )) : (
            <div className="glass-card p-16 text-center text-neutral-500 dark:text-dark-text-secondary">
              No scanners yet. Create your first scanner account.
            </div>
          )}
        </div>

        {scanners?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-4">
            {Array.from({ length: scanners.last_page }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => applyFilters({ page })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === scanners.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
