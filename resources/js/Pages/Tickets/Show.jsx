import { Link, router } from '@inertiajs/react';
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

export default function Show({ ticket, history, qrSvg, pdfExists }) {
  const [emailLoading, setEmailLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  const approve = () => {
    setApproving(true);
    router.post(route('registrations.approve', ticket.uuid), {}, {
      onFinish: () => setApproving(false),
    });
  };

  const sendEmail = async () => {
    setEmailLoading(true);
    await fetch(`/tickets/${ticket.uuid}/email`, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
    });
    setEmailLoading(false);
    window.location.reload();
  };

  const sendSms = async () => {
    setSmsLoading(true);
    await fetch(`/tickets/${ticket.uuid}/sms`, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
    });
    setSmsLoading(false);
    window.location.reload();
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/tickets" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Tickets</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">{ticket?.customer?.first_name} {ticket?.customer?.last_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                ticket.status === 'confirmed' || ticket.status === 'redeemed' ? 'bg-green-500/10 text-green-400' :
                ticket.status === 'rejected' || ticket.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{ticket?.customer?.first_name} {ticket?.customer?.last_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={ticket.status} size="md" />
                  <span className="text-sm text-neutral-500 capitalize">{ticket.ticket_type} · {ticket.event?.title}</span>
                </div>
              </div>
            </div>
            {ticket.status === 'pending_approval' && (
              <button onClick={approve} disabled={approving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  bg-green-500 text-white hover:bg-green-400 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25"
              >
                {approving ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
                {approving ? 'Approving...' : 'Approve'}
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">QR Code</h2>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white p-2 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-3 font-mono tracking-wider">{ticket.qr_code}</p>
                <div className="flex items-center gap-2 mt-4">
                  <a href={`/tickets/${ticket.uuid}/download`} className="btn-green h-10 px-5 text-sm inline-flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 font-medium transition-all">
                    📄 Download PDF
                  </a>
                  <Link href={`/tickets/${ticket.uuid}/print`} className="btn-ghost h-10 px-5 text-sm inline-flex items-center gap-2">
                    🖨️ Print Ticket
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Send Ticket</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={sendEmail} disabled={emailLoading}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${emailLoading ? 'opacity-50 cursor-wait' : ''} btn-secondary`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {emailLoading ? 'Sending...' : 'Send via Email'}
                </button>
                <button onClick={sendSms} disabled={smsLoading}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${smsLoading ? 'opacity-50 cursor-wait' : ''} btn-secondary`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {smsLoading ? 'Sending...' : 'Send via SMS'}
                </button>
              </div>
            </motion.div>

            {history?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Timeline</h2>
                <Timeline items={history} />
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Details</h2>
              <DetailRow icon="🎟️" label="Type" value={ticket.ticket_type} />
              <DetailRow icon="💰" label="Price" value={ticket.price > 0 ? `${ticket.currency} ${Number(ticket.price).toFixed(2)}` : 'Free'} />
              <DetailRow icon="📋" label="Status" value={<StatusBadge status={ticket.status} />} />
              <DetailRow icon="📅" label="Registered" value={fmtDate(ticket.registered_at)} />
              <DetailRow icon="✅" label="Approved" value={fmtDate(ticket.approved_at)} />
              <DetailRow icon="❌" label="Rejected" value={fmtDate(ticket.rejected_at)} />
              <DetailRow icon="🔑" label="Checked In" value={fmtDate(ticket.checked_in_at)} />
              {ticket.rejection_reason && <DetailRow icon="💬" label="Reason" value={ticket.rejection_reason} />}
              <DetailRow icon="🔒" label="Reserved Until" value={fmtDate(ticket.reserved_until)} />
            </motion.div>

            {ticket.event && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Event</h2>
                <Link href={`/events/${ticket.event.uuid}`} className="block p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all">
                  <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{ticket.event.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">{ticket.event.start_date ? new Date(ticket.event.start_date).toLocaleDateString() : 'TBD'}</p>
                  {ticket.event.venue_name && <p className="text-xs text-neutral-500 mt-0.5">{ticket.event.venue_name}</p>}
                </Link>
              </motion.div>
            )}

            {ticket.customer && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Customer</h2>
                <Link href={`/customers/${ticket.customer.uuid}`} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-400">
                    {(ticket.customer.first_name?.charAt(0) || '') + (ticket.customer.last_name?.charAt(0) || '')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{ticket.customer.first_name} {ticket.customer.last_name}</p>
                    <p className="text-xs text-neutral-500">{ticket.customer.email}</p>
                  </div>
                </Link>
              </motion.div>
            )}

            {ticket.session && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Session</h2>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04]">
                  <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{ticket.session.title}</p>
                  {ticket.session.location && <p className="text-xs text-neutral-500 mt-0.5">{ticket.session.location}</p>}
                  <p className="text-xs text-neutral-500 mt-0.5">{ticket.session.start_time} — {ticket.session.end_time}</p>
                </div>
              </motion.div>
            )}

            {ticket.approver && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Approved By</h2>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04]">
                  <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{ticket.approver.name}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
