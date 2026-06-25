import { Link } from '@inertiajs/inertia-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';
import Timeline from '@/Components/UI/Timeline';

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-neutral-100 dark:border-white/[0.04] last:border-0">
      <span className="flex items-center gap-2 text-sm text-neutral-500"><span>{icon}</span> {label}</span>
      <span className="text-sm text-neutral-700 dark:text-dark-text font-medium">{value || '—'}</span>
    </div>
  );
}

export default function Show({ registration, actions, waitingList }) {
  const [actionType, setActionType] = useState('approve');
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { event, customer } = registration;

  const executeAction = async (action) => {
    setIsProcessing(true);
    const formData = new FormData();
    if (action === 'approve') formData.append('notes', notes);
    else if (action === 'reject') { formData.append('reason', rejectReason); formData.append('notes', notes); }
    else if (action === 'cancel') { formData.append('reason', cancelReason); }
    await fetch(`/registrations/${registration.uuid}/${action}`, {
      method: 'POST',
      body: formData,
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
    });
    setIsProcessing(false);
    window.location.reload();
  };

  const canApprove = ['reserved', 'pending_approval'].includes(registration.status);
  const canReject = ['reserved', 'pending_approval', 'confirmed'].includes(registration.status);
  const canCancel = !['cancelled', 'redeemed'].includes(registration.status);
  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/registrations" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Registrations</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">{customer?.first_name} {customer?.last_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                registration.status === 'confirmed' || registration.status === 'redeemed' ? 'bg-green-500/10 text-green-400' :
                registration.status === 'rejected' || registration.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {registration.ticket_type?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{customer?.first_name} {customer?.last_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={registration.status} size="md" />
                  <span className="text-sm text-neutral-500 capitalize">{registration.ticket_type} · {event?.title}</span>
                </div>
              </div>
            </div>
            {customer && (
              <Link href={`/customers/${customer.uuid}`} className="btn-secondary h-10 px-5 text-sm">View Customer</Link>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Actions</h2>
              {canApprove && (
                <div className="mb-4 p-4 rounded-xl bg-green-500/[0.02] border border-green-500/20 space-y-3">
                  <h3 className="text-sm font-medium text-green-400">Approve Registration</h3>
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." className="w-full input-field" />
                  <button onClick={() => executeAction('approve')} disabled={isProcessing} className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all">Approve</button>
                </div>
              )}
              {canReject && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/[0.02] border border-red-500/20 space-y-3">
                  <h3 className="text-sm font-medium text-red-400">Reject Registration</h3>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={2} placeholder="Reason for rejection..." className="w-full input-field resize-none" />
                  <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes..." className="w-full input-field" />
                  <button onClick={() => executeAction('reject')} disabled={isProcessing || !rejectReason} className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all">Reject</button>
                </div>
              )}
              {canCancel && (
                <div>
                  <button onClick={() => setShowCancel(!showCancel)} className="text-sm text-red-400 hover:text-red-300 underline underline-offset-2">
                    Cancel this registration
                  </button>
                  {showCancel && (
                    <div className="mt-3 p-4 rounded-xl bg-red-500/[0.02] border border-red-500/20 space-y-3">
                      <input type="text" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation..." className="w-full input-field" />
                      <button onClick={() => executeAction('cancel')} disabled={isProcessing} className="w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all">Confirm Cancellation</button>
                    </div>
                  )}
                </div>
              )}
              {!canApprove && !canReject && !canCancel && (
                <p className="text-sm text-neutral-500">No actions available for this registration status.</p>
              )}
            </motion.div>

            {actions?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Timeline</h2>
                <Timeline items={actions} />
              </motion.div>
            )}

            {waitingList?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Waiting List</h2>
                <div className="space-y-2">
                  {waitingList.map((w) => (
                    <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04]">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold">#{w.position}</span>
                      <span className="text-sm text-neutral-700 dark:text-dark-text">{w.customer?.first_name} {w.customer?.last_name}</span>
                      <StatusBadge status={w.status} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Details</h2>
              <DetailRow icon="🎟️" label="Ticket Type" value={registration.ticket_type} />
              <DetailRow icon="💰" label="Price" value={registration.price > 0 ? `${registration.currency} ${Number(registration.price).toFixed(2)}` : 'Free'} />
              <DetailRow icon="📋" label="Status" value={<StatusBadge status={registration.status} />} />
              <DetailRow icon="📅" label="Registered" value={fmtDate(registration.registered_at)} />
              <DetailRow icon="✅" label="Approved" value={fmtDate(registration.approved_at)} />
              <DetailRow icon="❌" label="Rejected" value={fmtDate(registration.rejected_at)} />
              <DetailRow icon="🔑" label="Checked In" value={fmtDate(registration.checked_in_at)} />
              {registration.rejection_reason && <DetailRow icon="💬" label="Reason" value={registration.rejection_reason} />}
              <DetailRow icon="🏷️" label="QR Code" value={<span className="text-[10px] font-mono text-neutral-500 truncate block max-w-[150px]">{registration.qr_code}</span>} />
            </motion.div>

            {event && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Event</h2>
                <Link href={`/events/${event.uuid}`} className="block p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all">
                  <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{event.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">{new Date(event.start_date).toLocaleDateString()}</p>
                  {event.venue_name && <p className="text-xs text-neutral-500 mt-0.5">{event.venue_name}</p>}
                </Link>
              </motion.div>
            )}

            {customer && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Customer</h2>
                <Link href={`/customers/${customer.uuid}`} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-400">
                    {(customer.first_name?.charAt(0) || '') + (customer.last_name?.charAt(0) || '')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{customer.first_name} {customer.last_name}</p>
                    <p className="text-xs text-neutral-500">{customer.email}</p>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
