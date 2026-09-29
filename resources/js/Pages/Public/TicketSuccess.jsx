import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';

export default function TicketSuccess({ ticket, downloadUrl, qrSvg, paid = false }) {
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <PublicLayout>
            <Head title="Ticket Confirmed" />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 mx-auto rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6"
                    >
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                        {paid ? 'Payment successful!' : "You're all set!"}
                    </h1>
                    <p className="mt-3 text-neutral-500 dark:text-white/40 max-w-md mx-auto">
                        {paid
                            ? 'Your payment was successful and your ticket is confirmed. A copy has been emailed to '
                            : 'Your ticket is confirmed — no payment was needed. A copy has been emailed to '}
                        <span className="text-neutral-700 dark:text-white/70">{ticket?.customer?.email}</span>.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-3xl bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.06] overflow-hidden mb-8"
                >
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-[11px] font-semibold tracking-widest uppercase text-primary-400 mb-1">
                                    {ticket?.event?.event_type} Event
                                </p>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{ticket?.event?.title}</h2>
                            </div>
                            <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide">
                                Confirmed
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            {[
                                { label: 'Date', value: fmtDate(ticket?.event?.start_date) },
                                { label: 'Time', value: ticket?.event?.start_date ? `${fmtTime(ticket.event.start_date)} – ${fmtTime(ticket.event.end_date)}` : '—' },
                                { label: 'Venue', value: ticket?.event?.venue_name || '—' },
                                { label: 'Attendee', value: ticket?.customer?.name || '—' },
                            ].map((info) => (
                                <div key={info.label} className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06]">
                                    <p className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-white/30">{info.label}</p>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-white/80 mt-1">{info.value}</p>
                                </div>
                            ))}
                        </div>

                        {ticket?.session && (
                            <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06]">
                                <p className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-white/30">Session</p>
                                <p className="text-sm font-medium text-neutral-800 dark:text-white/80 mt-1">
                                    {ticket.session.title} • {fmtTime(ticket.session.start_time)}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-neutral-200 dark:border-white/[0.06]">
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-white/30">Ticket</p>
                                <p className="text-sm font-semibold text-neutral-800 dark:text-white/80 mt-0.5 capitalize">
                                    {ticket?.ticket_type} {ticket?.price > 0 ? `• BDT ${Number(ticket.price).toLocaleString()}` : '• Free'}
                                </p>
                            </div>
                            <p className="text-[11px] text-neutral-400 dark:text-white/25 font-mono">{ticket?.uuid}</p>
                        </div>
                    </div>

                    {/* QR pass */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 px-6 sm:px-8 py-8 bg-neutral-50 dark:bg-white/[0.02] border-t border-dashed border-neutral-300 dark:border-white/[0.1]">
                        <div className="w-44 h-44 bg-white rounded-2xl p-3 flex items-center justify-center shrink-0 shadow-lg">
                            <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: qrSvg || '' }} />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">Scan at the gate to check in</p>
                            <p className="text-sm text-neutral-500 dark:text-white/40 mt-1 max-w-xs">
                                Keep the QR on your phone, or print the PDF ticket. Both work at entry.
                            </p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary mt-5 px-6 py-2.5 text-sm inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download ticket (PDF)
                            </a>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Link href={appUrl('/track-tickets')} className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm font-medium text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all">
                        Track my tickets
                    </Link>
                    <Link href={appUrl('/browse')} className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm font-medium text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all">
                        Browse more events
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}