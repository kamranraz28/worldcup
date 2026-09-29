import { motion } from 'framer-motion';

const fieldClass = 'input-field w-full';
const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export default function ScannerForm({ form, events, isEdit = false }) {
  const { data, setData, errors } = form;
  const selected = data.event_ids || [];

  const toggleEvent = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setData('event_ids', next);
  };

  const toggleAll = () => {
    setData('event_ids', selected.length === events.length ? [] : events.map((e) => e.id));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={fieldClass} placeholder="Scanner name" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className={fieldClass} placeholder="01712345678" />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={fieldClass} placeholder="scanner@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>{isEdit ? 'New Password' : 'Password'}{isEdit && <span className="text-neutral-400 font-normal"> (leave blank to keep)</span>}</label>
            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={fieldClass} placeholder="••••••••" autoComplete="new-password" />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={fieldClass} placeholder="••••••••" autoComplete="new-password" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-neutral-300 dark:border-white/10 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-neutral-700 dark:text-dark-text">Active</span>
            </label>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Assigned Events</h2>
          <button type="button" onClick={toggleAll} className="text-xs font-medium text-primary-400 hover:text-primary-300">
            {selected.length === events.length ? 'Clear all' : 'Select all'}
          </button>
        </div>
        {errors.event_ids && <p className="mb-3 text-xs text-red-400">{errors.event_ids}</p>}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {events.map((e) => (
            <label key={e.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(e.id) ? 'bg-primary-500/10 border-primary-500/30' : 'bg-neutral-50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'}`}>
              <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleEvent(e.id)} className="h-4 w-4 rounded border-neutral-300 dark:border-white/10 text-primary-500 focus:ring-primary-500" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{e.title}</p>
                <p className="text-xs text-neutral-500 dark:text-dark-text-secondary truncate">{e.venue_name || '—'} • {fmtDate(e.start_date)} • {e.status}</p>
              </div>
            </label>
          ))}
          {events.length === 0 && <p className="text-sm text-neutral-500 dark:text-dark-text-secondary py-4 text-center">No events available.</p>}
        </div>
      </motion.div>
    </div>
  );
}
