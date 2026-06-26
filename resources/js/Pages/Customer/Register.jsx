import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Register({ event, ticketTypes }) {
    const { errors } = usePage().props;
    const [ticketType, setTicketType] = useState('general');
    const [sessionId, setSessionId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(route('customer.events.register.store', event.uuid), {
            ticket_type: ticketType,
            event_session_id: sessionId || undefined,
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href={`/browse/${event.uuid}`} className="text-sm text-neutral-500 dark:text-dark-text-secondary hover:text-neutral-700 dark:hover:text-white transition-colors inline-flex items-center gap-1 mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to event
                    </Link>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Get Your Ticket</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">{event.title}</p>
                </motion.div>

                <div className="glass-card p-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">Date</p>
                            <p className="font-medium text-neutral-900 dark:text-white">{fmtDate(event.start_date)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">Venue</p>
                            <p className="font-medium text-neutral-900 dark:text-white">{event.venue_name || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">Time</p>
                            <p className="font-medium text-neutral-900 dark:text-white">{fmtTime(event.start_date)} - {fmtTime(event.end_date)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">Price</p>
                            <p className="font-medium text-neutral-900 dark:text-white">{event.ticket_price > 0 ? `BDT ${Number(event.ticket_price).toLocaleString()}` : 'Free'}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="glass-card p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Ticket Type</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {ticketTypes.map(t => (
                                <button key={t} type="button" onClick={() => setTicketType(t)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${ticketType === t ? 'bg-primary-500/10 border-primary-500/30 text-primary-500' : 'bg-neutral-50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-dark-text-secondary hover:border-neutral-300 dark:hover:border-white/20'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                        {errors?.ticket_type && <p className="text-xs text-red-500">{errors.ticket_type}</p>}
                    </div>

                    {event.sessions?.length > 0 && (
                        <div className="glass-card p-5 space-y-3">
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Select Session</h2>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 cursor-pointer hover:border-neutral-300 dark:hover:border-white/20 transition-all">
                                    <input type="radio" name="session" value="" checked={!sessionId} onChange={() => setSessionId('')} className="text-primary-500 focus:ring-primary-500" />
                                    <span className="text-sm text-neutral-600 dark:text-dark-text-secondary">No session preference</span>
                                </label>
                                {event.sessions.map(s => (
                                    <label key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 cursor-pointer hover:border-neutral-300 dark:hover:border-white/20 transition-all">
                                        <input type="radio" name="session" value={s.id} checked={sessionId === s.id} onChange={() => setSessionId(s.id)} className="text-primary-500 focus:ring-primary-500" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{s.title}</p>
                                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">{s.location} • {fmtTime(s.start_time)} - {fmtTime(s.end_time)}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button type="submit"
                            disabled={event.isFull || submitting}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:from-primary-400 hover:to-primary-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : 'Get Your Ticket'}
                        </button>
                        <Link href={`/browse/${event.uuid}`} className="text-sm text-neutral-500 dark:text-dark-text-secondary hover:text-neutral-700 dark:hover:text-white transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
