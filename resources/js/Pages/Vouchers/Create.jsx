import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

const fieldClass = 'input-field w-full';
const labelClass = 'block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5';

export default function Create() {
  const form = useForm({
    code: '',
    description: '',
    discount_percent: 15,
    max_uses: 10,
    starts_at: '',
    expires_at: '',
    is_active: true,
  });

  const submit = (e) => {
    e.preventDefault();
    form.post('/vouchers');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/vouchers" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Vouchers</Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Create</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">New Voucher</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Offer a percentage discount, e.g. 15% for the first 10 customers.</p>
        </motion.div>

        <form onSubmit={submit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className={labelClass}>Voucher Code</label>
              <input type="text" value={form.data.code} onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                className={`${fieldClass} font-mono uppercase`} placeholder="EARLY15" />
              {form.errors.code && <p className="mt-1 text-xs text-red-400">{form.errors.code}</p>}
            </div>
            <div>
              <label className={labelClass}>Description <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input type="text" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)}
                className={fieldClass} placeholder="Early bird 15% off" />
              {form.errors.description && <p className="mt-1 text-xs text-red-400">{form.errors.description}</p>}
            </div>
          </div>

          <div className="glass-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Discount (%)</label>
              <input type="number" step="0.01" min="0.01" max="100" value={form.data.discount_percent}
                onChange={(e) => form.setData('discount_percent', e.target.value)} className={fieldClass} placeholder="15" />
              {form.errors.discount_percent && <p className="mt-1 text-xs text-red-400">{form.errors.discount_percent}</p>}
            </div>
            <div>
              <label className={labelClass}>Max Uses (# customers)</label>
              <input type="number" min="1" value={form.data.max_uses}
                onChange={(e) => form.setData('max_uses', e.target.value)} className={fieldClass} placeholder="10" />
              {form.errors.max_uses && <p className="mt-1 text-xs text-red-400">{form.errors.max_uses}</p>}
            </div>
            <div>
              <label className={labelClass}>Starts At <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input type="datetime-local" value={form.data.starts_at} onChange={(e) => form.setData('starts_at', e.target.value)} className={fieldClass} />
              {form.errors.starts_at && <p className="mt-1 text-xs text-red-400">{form.errors.starts_at}</p>}
            </div>
            <div>
              <label className={labelClass}>Expires At <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input type="datetime-local" value={form.data.expires_at} onChange={(e) => form.setData('expires_at', e.target.value)} className={fieldClass} />
              {form.errors.expires_at && <p className="mt-1 text-xs text-red-400">{form.errors.expires_at}</p>}
            </div>
          </div>

          <div className="glass-card p-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">Active</p>
                <p className="text-xs text-neutral-500">Voucher can be redeemed while active</p>
              </div>
              <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="sr-only peer" />
              <div className="relative w-11 h-6 rounded-full bg-white/[0.08] peer-checked:bg-primary-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={form.processing} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {form.processing ? 'Saving...' : 'Create Voucher'}
            </button>
            <Link href="/vouchers" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-white">Cancel</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
