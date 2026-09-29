import { useState } from 'react';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';
import EventCover from '../../Components/Events/EventCover';

const easeOut = [0.22, 1, 0.36, 1];

const STATUS_PILL = {
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/25',
    redeemed: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
};

export default function TrackTickets({ tickets = [], searchedPhone = null, downloadAllUrl = null }) {
    const { errors, flash } = usePage().props;
    const [phone, setPhone] = useState(searchedPhone || '');
    const [searching, setSearching] = useState(false);

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

    const search = (e) => {
        e.preventDefault();
        setSearching(true);
        router.post(appUrl('/track-tickets'), { phone }, {
            onError: () => setSearching(false),
            onFinish: () => setSearching(false),
        });
    };

    return (
        <PublicLayout>
            <Head title="Track Tickets" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="text-center mb-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
                        className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-2 backdrop-blur"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-400" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600 dark:text-white/60">Ticket tracking</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
                        className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                    >
                        Find your{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-gold-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                            tickets
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                        className="mx-auto mt-4 max-w-xl text-base text-neutral-500 dark:text-white/40"
                    >
                        Enter the phone number you registered with. All tickets bought on that number appear together — download any or all.
                    </motion.p>
                </motion.div>

                {/* Search card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
                    className="relative mx-auto mb-12 max-w-xl rounded-2xl p-px"
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/40 via-gold-400/30 to-blue-400/40 opacity-70" />
                    <form onSubmit={search} className="relative rounded-[calc(1rem-1px)] bg-white/95 dark:bg-dark-surface/90 p-4 backdrop-blur-xl">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <label htmlFor="track-phone" className="sr-only">Phone number</label>
                                <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    id="track-phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 01712 345678"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={searching}
                                className="btn-primary h-12 px-6 text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                            >
                                {searching ? (
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                ) : (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                Find tickets
                            </button>
                        </div>
                        {errors?.phone && <p className="mt-2 text-xs text-red-400 text-center">{errors.phone}</p>}
                        {flash?.error && (
                            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                                {flash.error}
                            </div>
                        )}
                    </form>
                </motion.div>

                {/* No results */}
                {searchedPhone && tickets.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: easeOut }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/40 to-primary-500/40 blur-xl" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04]">
                                <svg className="h-8 w-8 text-neutral-500 dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No tickets found</h3>
                        <p className="mt-1 max-w-sm text-sm text-neutral-400 dark:text-white/30">
                            We couldn't find any confirmed tickets for <span className="text-neutral-600 dark:text-white/60">{searchedPhone}</span>.
                            Double-check the number or contact the event team.
                        </p>
                    </motion.div>
                )}

                {/* Results */}
                {tickets.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: easeOut }}>
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                    {tickets.length} ticket{tickets.length > 1 ? 's' : ''} found
                                </h2>
                                <p className="mt-0.5 text-xs text-neutral-400 dark:text-white/30">Registered phone: {searchedPhone}</p>
                            </div>
                            {downloadAllUrl && (
                                <a
                                    href={downloadAllUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/30 active:translate-y-0"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download all ({tickets.length})
                                </a>
                            )}
                        </div>

                        <div className="space-y-4">
                            {tickets.map((t, i) => (
                                <motion.div
                                    key={t.uuid}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.45, ease: easeOut }}
                                    className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4 backdrop-blur transition-colors hover:border-neutral-300 dark:hover:border-white/15 sm:flex-row sm:p-5"
                                >
                                    {/* colour accent edge */}
                                    <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-500 via-gold-400 to-blue-400 opacity-60 transition-opacity group-hover:opacity-100" />

                                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] sm:h-28 sm:w-40">
                                        <EventCover event={t.event} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <Link
                                                    href={appUrl(`/browse/${t.event?.uuid}`)}
                                                    className="text-base font-semibold text-neutral-900 dark:text-white transition-colors hover:text-primary-400"
                                                >
                                                    {t.event?.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-neutral-400 dark:text-white/30">
                                                    {t.event && fmtDate(t.event.start_date)}{t.event?.venue_name ? ` • ${t.event.venue_name}` : ''}
                                                </p>
                                                {t.session && (
                                                    <p className="mt-0.5 text-xs text-neutral-400 dark:text-white/30">
                                                        {t.session.title} • {fmtTime(t.session.start_time)}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_PILL[t.status] || 'bg-primary-500/10 text-primary-400 border-primary-500/20'}`}>
                                                {t.status === 'confirmed' ? 'Paid & confirmed' : t.status === 'redeemed' ? 'Redeemed' : t.status}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 dark:border-white/[0.05] pt-3">
                                            <p className="text-sm text-neutral-500 dark:text-white/50">
                                                <span className="mr-1.5 text-[11px] uppercase text-neutral-400 dark:text-white/30">{t.ticket_type}</span>
                                                • Registered {t.registered_at ? fmtDate(t.registered_at) : '—'}
                                            </p>
                                            <a
                                                href={t.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.06] px-4 py-2 text-sm font-medium text-neutral-800 dark:text-white/80 transition-all hover:bg-neutral-100 dark:hover:bg-white/[0.12] hover:text-neutral-900 dark:hover:text-white"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <p className="mt-6 text-center text-[11px] text-neutral-400 dark:text-white/25">
                            Download links are temporary and expire automatically — grab them now or re-run the search later.
                        </p>
                    </motion.div>
                )}
            </div>
        </PublicLayout>
    );
}