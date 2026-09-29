import { useState } from 'react';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';
import EventCover from '../../Components/Events/EventCover';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// The public site is dark by default, so fields carry explicit dark colors
// (same palette as the Sign in page) instead of relying on dark: variants.
const FIELD_CLASSES = '!bg-dark-surface !border-dark-border !text-dark-text !placeholder-dark-text-secondary';

export default function Register({ event }) {
    const { errors, flash } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        event_session_id: event?.sessions?.length ? '' : undefined,
        voucher_code: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const price = event?.is_early_booking && event.early_booking_price != null
        ? Number(event.early_booking_price)
        : Number(event?.ticket_price ?? 0);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(appUrl(`/browse/${event.uuid}/register`), form, {
            onError: () => setSubmitting(false),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <PublicLayout>
            <Head title={`Register — ${event?.title ?? 'Event'}`} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href={appUrl(`/browse/${event.uuid}`)} className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to event
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                        {/* Event summary */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="aspect-[21/9] bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden relative">
                                <EventCover event={event} />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent" />
                            </div>
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                <h1 className="text-xl font-bold text-white">{event.title}</h1>
                                <div className="mt-3 space-y-2 text-sm">
                                    <p className="text-white/50"><span className="text-white/30">Date</span><br />{fmtDate(event.start_date)}</p>
                                    <p className="text-white/50"><span className="text-white/30">Time</span><br />{fmtTime(event.start_date)} – {fmtTime(event.end_date)}</p>
                                    {event.venue_name && <p className="text-white/50"><span className="text-white/30">Venue</span><br />{event.venue_name}</p>}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                                    <span className="text-sm text-white/30">Ticket price</span>
                                    {price > 0 ? (
                                        <span className="text-lg font-bold text-primary-400">BDT {price.toLocaleString()}</span>
                                    ) : (
                                        <span className="text-lg font-bold text-green-400">Free</span>
                                    )}
                                </div>
                                {event.is_early_booking && (
                                    <p className="text-xs text-emerald-400 mt-2">
                                        Early booking price applied{event.early_booking_deadline ? ` until ${fmtDate(event.early_booking_deadline)}` : ''}.
                                    </p>
                                )}
                            </div>
                            <div className="p-4 rounded-2xl bg-primary-500/[0.06] border border-primary-500/20">
                                <p className="text-xs text-primary-300 leading-relaxed">
                                    No account needed. Enter your details, pay securely, and your ticket is emailed to you instantly.
                                    Lost it? Find it any time via <Link href={appUrl('/track-tickets')} className="underline underline-offset-2 font-medium">Track Tickets</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Checkout form — field styling matches the Sign in page */}
                        <form
                            onSubmit={submit}
                            className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06]"
                        >
                            <h2 className="text-lg font-bold tracking-tight text-white mb-1">Register for this event</h2>
                            <p className="text-sm text-dark-text-secondary mb-6">Your details are used only for this ticket.</p>

                            {flash?.error && (
                                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                    {flash.error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <InputLabel value="Full name" className="!text-dark-text" />
                                    <TextInput id="reg-name" name="name" type="text" value={form.name} onChange={set('name')}
                                        placeholder="e.g. Mashrafe Rahman" autoComplete="name" className={FIELD_CLASSES} />
                                    <InputError message={errors.name} className="!text-red-400" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <InputLabel value="Email" className="!text-dark-text" />
                                        <TextInput id="reg-email" name="email" type="email" value={form.email} onChange={set('email')}
                                            placeholder="you@example.com" autoComplete="email" className={FIELD_CLASSES} />
                                        <InputError message={errors.email} className="!text-red-400" />
                                    </div>
                                    <div>
                                        <InputLabel value="Phone (BD)" className="!text-dark-text" />
                                        <TextInput id="reg-phone" name="phone" type="tel" value={form.phone} onChange={set('phone')}
                                            placeholder="01712 345678" autoComplete="tel" className={FIELD_CLASSES} />
                                        <InputError message={errors.phone} className="!text-red-400" />
                                    </div>
                                </div>

                                {event?.sessions?.length > 0 && (
                                    <div>
                                        <InputLabel value="Session (optional)" className="!text-dark-text" />
                                        <select
                                            id="reg-session"
                                            name="event_session_id"
                                            value={form.event_session_id ?? ''}
                                            onChange={set('event_session_id')}
                                            className={`input-field ${FIELD_CLASSES} cursor-pointer`}
                                        >
                                            <option value="" className="bg-dark-surface text-dark-text">Any session</option>
                                            {event.sessions.map((s) => (
                                                <option key={s.id} value={s.id} className="bg-dark-surface text-dark-text">
                                                    {s.title} — {fmtTime(s.start_time)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <InputLabel value="Voucher code (optional)" className="!text-dark-text" />
                                    <TextInput id="reg-voucher" name="voucher_code" type="text" value={form.voucher_code} onChange={set('voucher_code')}
                                        placeholder="e.g. WELCOME10" className={FIELD_CLASSES} />
                                    <InputError message={errors.voucher_code} className="!text-red-400" />
                                </div>

                                <div className="space-y-3">
                                    <PrimaryButton type="submit" className="w-full justify-center" disabled={submitting}>
                                        {submitting ? (
                                            <span className="inline-flex items-center gap-2">
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                </svg>
                                                Processing…
                                            </span>
                                        ) : price > 0 ? (
                                            <>Proceed to Payment — BDT {price.toLocaleString()}</>
                                        ) : (
                                            <>Get my free ticket</>
                                        )}
                                    </PrimaryButton>
                                    <p className="text-xs text-dark-text-secondary leading-relaxed">
                                        You will be redirected to our secure payment partner (ShurjoPay). If payment is not completed, no reservation is kept.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}