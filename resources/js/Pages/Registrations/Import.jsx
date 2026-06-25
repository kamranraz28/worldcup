import { useForm, Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Import({ events }) {
  const form = useForm({ event_id: '', status: 'confirmed', import_file: null });
  const handleSubmit = (e) => { e.preventDefault(); form.post('/registrations-import'); };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/registrations" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Registrations</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Import</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Bulk Import Registrations</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Upload a CSV file with customer registrations</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Event</label>
              <select value={form.data.event_id} onChange={(e) => form.setData('event_id', e.target.value)}
                className={`w-full input-field ${form.errors.event_id ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                <option value="">Select event...</option>
                {events?.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              {form.errors.event_id && <p className="mt-1 text-xs text-red-400">{form.errors.event_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Default Status</label>
              <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="w-full input-field">
                <option value="confirmed">Confirmed</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">CSV File</label>
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] cursor-pointer hover:border-primary-500/40 hover:bg-primary-500/5 transition-all">
                {form.data.import_file ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-green-400">{form.data.import_file.name}</span>
                    <span className="text-[10px] text-neutral-500">Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-neutral-500">Click to upload CSV</span>
                    <span className="text-[10px] text-neutral-400">Max 10MB</span>
                  </div>
                )}
                <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => form.setData('import_file', e.target.files[0])} className="hidden" />
              </label>
              {form.errors.import_file && <p className="mt-1 text-xs text-red-400">{form.errors.import_file}</p>}
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04]">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-dark-text mb-2">CSV Format</h3>
              <p className="text-xs text-neutral-500 mb-2">Your CSV should include these columns:</p>
              <code className="block text-[10px] text-neutral-400 bg-neutral-100 dark:bg-white/[0.02] p-2 rounded-lg font-mono">
                customer_id,customer_email,ticket_type,price,currency,status
              </code>
              <p className="text-xs text-neutral-500 mt-2">customer_id OR customer_email is required per row.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-end gap-4 pt-6 pb-8">
            <Link href="/registrations" className="btn-secondary h-10 px-6 text-sm">Cancel</Link>
            <button type="submit" disabled={form.processing} className="btn-primary h-10 px-6 text-sm">
              {form.processing ? 'Importing...' : 'Import Registrations'}
            </button>
          </motion.div>
        </form>
      </div>
    </AppLayout>
  );
}
