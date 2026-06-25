import { Link } from '@inertiajs/inertia-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function WaitingList({ event, waitingList }) {
  const [notifyCount, setNotifyCount] = useState(1);
  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotify = async () => {
    setIsNotifying(true);
    const formData = new FormData();
    formData.append('count', notifyCount);
    await fetch(`/events/${event.uuid}/waiting-list/notify`, {
      method: 'POST', body: formData,
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
    });
    setIsNotifying(false);
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/registrations" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Registrations</Link>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Waiting List</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Waiting List</h1>
              <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">{event.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-neutral-500">Capacity</p>
                <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{event.confirmed_count || 0} / {event.max_capacity || '∞'}</p>
              </div>
              <Link href={`/events/${event.uuid}`} className="btn-secondary h-10 px-4 text-sm">View Event</Link>
            </div>
          </div>
        </motion.div>

        {waitingList?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-2">
              {waitingList.map((entry, i) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-sm font-bold text-amber-400">#{entry.position}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{entry.customer?.first_name} {entry.customer?.last_name}</p>
                    <p className="text-xs text-neutral-500">{entry.customer?.email} · {entry.customer?.phone}</p>
                  </div>
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-neutral-500 capitalize">{entry.ticket_type}</span>
                </motion.div>
              ))}
            </div>
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Notify Next</h2>
                <p className="text-xs text-neutral-500 mb-4">Notify the next people on the waiting list that tickets are available.</p>
                <div className="flex items-center gap-3">
                  <input type="number" value={notifyCount} onChange={(e) => setNotifyCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                    min="1" max="100" className="w-20 input-field text-center" />
                  <button onClick={handleNotify} disabled={isNotifying}
                    className="flex-1 btn-primary h-10 px-4 text-sm">
                    {isNotifying ? 'Notifying...' : 'Notify'}
                  </button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Summary</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Waiting', value: waitingList.filter(w => w.status === 'waiting').length },
                    { label: 'Notified', value: waitingList.filter(w => w.status === 'notified').length },
                    { label: 'Total', value: waitingList.length },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-sm">
                      <span className="text-neutral-500">{s.label}</span>
                      <span className="text-neutral-700 dark:text-dark-text">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No one on the waiting list</h3>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">The waiting list is empty for this event.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
