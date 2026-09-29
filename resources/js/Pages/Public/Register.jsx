import { useState } from 'react';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';
import EventCover from '../../Components/Events/EventCover';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const easeOut = [0.22, 1, 0.36, 1];

// The public site is dark by default, so fields carry explicit dark colours.
const FIELD_CLASSES = '!bg-white !border-neutral-300 !text-neutral-900 !placeholder-neutral-400 dark:!bg-dark-surface dark:!border-dark-border dark:!text-dark-text dark:!placeholder-dark-text-secondary';

const INFO_ICONS = {
    date: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    time: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    venue: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
};

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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                >
                    <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                        <Link href={appUrl(`/browse/${event.uuid}`)} className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-white/40 transition-colors hover:text-neutral-900 dark:hover:text-white/70 mb-6">
                            <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to event
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                        {/* Event summary */}
                        <div className="lg:col-span-2 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
                                className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/[0.07]"
                            >
                                <EventCover event={event} />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 dark:bg-dark-bg/70 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur">
                                        <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                                        {event.event_type?.toUpperCase()}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.22, duration: 0.5, ease: easeOut }}
                                className="rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-5 backdrop-blur"
                            >
                                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{event.title}</h1>
                                <div className="mt-4 space-y-3">
                                    {[
                                        { icon: INFO_ICONS.date, label: 'Date', value: fmtDate(event.start_date) },
                                        { icon: INFO_ICONS.time, label: 'Time', value: `${fmtTime(event.start_date)} – ${fmtTime(event.end_date)}` },
                                        ...(event.venue_name ? [{ icon: INFO_ICONS.venue, label: 'Venue', value: event.venue_name }] : []),
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-center gap-3 text-sm">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] text-primary-400">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={row.icon} />
                                                </svg>
                                            </span>
                                            <p className="text-neutral-600 dark:text-white/60">
                                                <span className="mr-1.5 text-neutral-400 dark:text-white/30">{row.label}</span>
                                                {row.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-neutral-200 dark:border-white/[0.06] pt-4">
                                    <span className="text-sm text-neutral-400 dark:text-white/30">Ticket price</span>
                                    {price > 0 ? (
                                        <span className="bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-2xl font-extrabold text-transparent">
                                            BDT {price.toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-2xl font-extrabold text-transparent">
                                            Free
                                        </span>
                                    )}
                                </div>
                                {event.is_early_booking && (
                                    <p className="mt-2 text-xs text-emerald-400">
                                        🎉 Early booking price applied{event.early_booking_deadline ? ` until ${fmtDate(event.early_booking_deadline)}` : ''}.
                                    </p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5, ease: easeOut }}
                                className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-primary-500/[0.06] p-4"
                            >
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/20 blur-2xl" />
                                <p className="relative text-xs leading-relaxed text-primary-600 dark:text-primary-300">
                                    🎟️ No account needed. Enter your details, pay securely, and your ticket is emailed to you instantly.
                                    Lost it? Find it any time via <Link href={appUrl('/track-tickets')} className="font-medium underline underline-offset-2">Track Tickets</Link>.
                                </p>
                            </motion.div>
                        </div>

                        {/* Checkout form */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
                            className="lg:col-span-3 relative rounded-3xl p-px"
                        >
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary-500/40 via-white/10 to-gold-400/30" />
                            <form
                                onSubmit={submit}
                                className="relative rounded-[calc(1.5rem-1px)] bg-white/95 dark:bg-dark-surface/90 p-6 backdrop-blur-2xl sm:p-8"
                            >
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-rose-500 text-lg shadow-lg">🎫</span>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Register for this event</h2>
                                        <p className="text-sm text-neutral-500 dark:text-white/40">Your details are used only for this ticket.</p>
                                    </div>
                                </div>

                                {flash?.error && (
                                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                        {flash.error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div>
                                        <InputLabel value="Full name" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                        <TextInput id="reg-name" name="name" type="text" value={form.name} onChange={set('name')}
                                            placeholder="e.g. Mashrafe Rahman" autoComplete="name" className={FIELD_CLASSES} />
                                        <InputError message={errors.name} className="!text-red-400" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <InputLabel value="Email" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                            <TextInput id="reg-email" name="email" type="email" value={form.email} onChange={set('email')}
                                                placeholder="you@example.com" autoComplete="email" className={FIELD_CLASSES} />
                                            <InputError message={errors.email} className="!text-red-400" />
                                        </div>
                                        <div>
                                            <InputLabel value="Phone (BD)" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                            <TextInput id="reg-phone" name="phone" type="tel" value={form.phone} onChange={set('phone')}
                                                placeholder="01712 345678" autoComplete="tel" className={FIELD_CLASSES} />
                                            <InputError message={errors.phone} className="!text-red-400" />
                                        </div>
                                    </div>

                                    {event?.sessions?.length > 0 && (
                                        <div>
                                            <InputLabel value="Session (optional)" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                            <select
                                                id="reg-session"
                                                name="event_session_id"
                                                value={form.event_session_id ?? ''}
                                                onChange={set('event_session_id')}
                                                className={`input-field ${FIELD_CLASSES} cursor-pointer`}
                                            >
                                                <option value="" className="bg-white text-neutral-900 dark:bg-dark-surface dark:text-dark-text">Any session</option>
                                                {event.sessions.map((s) => (
                                                    <option key={s.id} value={s.id} className="bg-white text-neutral-900 dark:bg-dark-surface dark:text-dark-text">
                                                        {s.title} — {fmtTime(s.start_time)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <InputLabel value="Voucher code (optional)" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                        <TextInput id="reg-voucher" name="voucher_code" type="text" value={form.voucher_code} onChange={set('voucher_code')}
                                            placeholder="e.g. WELCOME10" className={FIELD_CLASSES} />
                                        <InputError message={errors.voucher_code} className="!text-red-400" />
                                    </div>

                                    <div className="space-y-3">
                                        <PrimaryButton type="submit" className="w-full justify-center h-12" disabled={submitting}>
                                            {submitting ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                                        <p className="text-center text-xs leading-relaxed text-neutral-400 dark:text-white/30">
                                            You will be redirected to our secure payment partner (ShurjoPay). If payment is not completed, no reservation is kept.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}