import { useForm, Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ events, customers }) {
  const form = useForm({
    event_id: '', customer_id: '', event_session_id: '',
    ticket_type: 'general', price: '', currency: 'PKR', status: 'confirmed',
  });
  const handleSubmit = (e) => { e.preventDefault(); form.post('/registrations'); };
  const selectedEvent = events?.find((e) => e.id === Number(form.data.event_id));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/registrations" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Registrations</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">New</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">New Registration</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Register a customer for an event</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Event</label>
              <select value={form.data.event_id} onChange={(e) => form.setData('event_id', e.target.value)}
                className={`w-full input-field ${form.errors.event_id ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                <option value="">Select event...</option>
                {events?.map((e) => <option key={e.id} value={e.id}>{e.title} — {new Date(e.start_date).toLocaleDateString()}</option>)}
              </select>
              {form.errors.event_id && <p className="mt-1 text-xs text-red-400">{form.errors.event_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Customer</label>
              <select value={form.data.customer_id} onChange={(e) => form.setData('customer_id', e.target.value)}
                className={`w-full input-field ${form.errors.customer_id ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                <option value="">Select customer...</option>
                {customers?.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.email}</option>)}
              </select>
              {form.errors.customer_id && <p className="mt-1 text-xs text-red-400">{form.errors.customer_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Ticket Type</label>
              <select value={form.data.ticket_type} onChange={(e) => form.setData('ticket_type', e.target.value)} className="w-full input-field">
                <option value="general">General</option>
                <option value="vip">VIP</option>
                <option value="vvip">VVIP</option>
                <option value="comp">Complimentary</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Price</label>
                <input type="number" step="0.01" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)}
                  className={`w-full input-field ${form.errors.price ? 'border-red-500/50 bg-red-500/5' : ''}`}
                  placeholder={selectedEvent?.ticket_price || '0'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Currency</label>
                <input type="text" value={form.data.currency} onChange={(e) => form.setData('currency', e.target.value.toUpperCase())}
                  className="w-full input-field" maxLength={3} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Status</label>
              <select value={form.data.status} onChange={(e) => form.setData('status', e.target.value)} className="w-full input-field">
                <option value="confirmed">Confirmed (Auto-Approve)</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            {selectedEvent?.requires_verification && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                This event requires identity verification. Customer must be verified before check-in.
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-end gap-4 pt-6 pb-8">
            <Link href="/registrations" className="btn-secondary h-10 px-6 text-sm">Cancel</Link>
            <button type="submit" disabled={form.processing} className="btn-primary h-10 px-6 text-sm">
              {form.processing ? 'Creating...' : 'Create Registration'}
            </button>
          </motion.div>
        </form>
      </div>
    </AppLayout>
  );
}
