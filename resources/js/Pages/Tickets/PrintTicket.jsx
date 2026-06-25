import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function PrintTicket({ ticket, qrSvg }) {
  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';
  const fmtTime = (d) => d ? new Date(d).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
          <div className="text-center p-8 bg-gradient-to-b from-primary-500/10 to-transparent border-b border-neutral-100 dark:border-white/[0.06]">
            <p className="text-xs text-primary-500 font-semibold tracking-widest uppercase mb-2">Toffee — FIFA World Cup 2026</p>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">{ticket.event?.title || 'Event Ticket'}</h1>
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">{ticket.status}</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Customer</p><p className="text-lg font-semibold text-neutral-900 dark:text-white">{ticket.customer?.first_name} {ticket.customer?.last_name}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Ticket Type</p><p className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">{ticket.ticket_type}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Date</p><p className="text-base text-neutral-700 dark:text-dark-text">{fmtDate(ticket.event?.start_date)}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Time</p><p className="text-base text-neutral-700 dark:text-dark-text">{fmtTime(ticket.event?.start_date)} — {fmtTime(ticket.event?.end_date)}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Venue</p><p className="text-base text-neutral-700 dark:text-dark-text">{ticket.event?.venue_name || 'TBD'}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Price</p><p className="text-base text-neutral-700 dark:text-dark-text">{ticket.currency} {ticket.price > 0 ? Number(ticket.price).toFixed(2) : 'Free'}</p></div>
            </div>

            {ticket.event?.venue_address && <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Address</p><p className="text-sm text-neutral-700 dark:text-dark-text">{ticket.event.venue_address}</p></div>}
            {ticket.session && <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Session</p><p className="text-sm text-neutral-700 dark:text-dark-text">{ticket.session.title}{ticket.session.location ? ` — ${ticket.session.location}` : ''}</p></div>}

            <div className="flex justify-center py-6 border-t border-b border-neutral-100 dark:border-white/[0.06]">
              <div className="text-center">
                <div className="w-48 h-48 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white p-2 mx-auto flex items-center justify-center" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <p className="text-xs text-neutral-500 mt-3 font-mono tracking-wider">{ticket.qr_code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Email</p><p className="text-sm text-neutral-700 dark:text-dark-text">{ticket.customer?.email || '—'}</p></div>
              <div><p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Phone</p><p className="text-sm text-neutral-700 dark:text-dark-text">{ticket.customer?.phone || '—'}</p></div>
            </div>
          </div>

          <div className="text-center p-6 border-t border-neutral-100 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.01]">
            <p className="text-sm font-bold text-primary-500">TOFFEE</p>
            <p className="text-xs text-neutral-500 mt-1">Official Partner — FIFA World Cup 2026</p>
            <p className="text-xs text-neutral-400 mt-1">Present this ticket with QR code at the venue for entry.</p>
          </div>
        </motion.div>

        <div className="flex justify-center mt-6">
          <button onClick={() => window.print()} className="btn-primary h-11 px-6 text-sm inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print This Page
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
