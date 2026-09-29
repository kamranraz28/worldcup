import { useState } from 'react';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';
import EventCover from '../../Components/Events/EventCover';

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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-5">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">Ticket Tracking</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Find your <span className="text-gradient-primary">tickets</span>
                        </h1>
                        <p className="mt-3 text-white/30 max-w-xl mx-auto">
                            Enter the phone number you registered with. All tickets bought on that number appear together — download any or all.
                        </p>
                    </div>

                    <motion.form
                        onSubmit={search}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto mb-12"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <label htmlFor="track-phone" className="sr-only">Phone number</label>
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    id="track-phone"
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 01712 345678"
                                    className="w-full h-13 pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={searching}
                                aria-label="Find tickets"
                                className="btn-primary px-7 py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {searching ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                Find tickets
                            </button>
                        </div>
                        {errors?.phone && <p className="mt-2 text-xs text-red-400 text-center">{errors.phone}</p>}
                        {flash?.error && (
                            <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm text-center">
                                {flash.error}
                            </div>
                        )}
                    </motion.form>

                    {searchedPhone && tickets.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white">No tickets found</h3>
                            <p className="text-sm text-white/30 mt-1 max-w-sm">
                                We couldn't find any confirmed tickets for <span className="text-white/60">{searchedPhone}</span>.
                                Double-check the number or contact the event team.
                            </p>
                        </div>
                    )}

                    {tickets.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {tickets.length} ticket{tickets.length > 1 ? 's' : ''} found
                                    </h2>
                                    <p className="text-xs text-white/30 mt-0.5">Registered phone: {searchedPhone}</p>
                                </div>
                                {downloadAllUrl && (
                                    <a
                                        href={downloadAllUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-300 text-sm font-medium hover:bg-primary-500/25 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                                    >
                                        <div className="w-full sm:w-40 h-24 sm:h-28 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] shrink-0 relative">
                                            <EventCover event={t.event} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div>
                                                    <Link href={appUrl(`/browse/${t.event?.uuid}`)} className="text-base font-semibold text-white hover:text-primary-400 transition-colors">
                                                        {t.event?.title}
                                                    </Link>
                                                    <p className="text-xs text-white/30 mt-1">
                                                        {t.event && fmtDate(t.event.start_date)}{t.event?.venue_name ? ` • ${t.event.venue_name}` : ''}
                                                    </p>
                                                    {t.session && (
                                                        <p className="text-xs text-white/30 mt-0.5">
                                                            {t.session.title} • {fmtTime(t.session.start_time)}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                                                    t.status === 'confirmed'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                                                }`}>
                                                    {t.status === 'confirmed' ? 'Paid & confirmed' : t.status === 'redeemed' ? 'Redeemed' : t.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.05]">
                                                <p className="text-sm text-white/50">
                                                    <span className="uppercase text-[11px] text-white/30 mr-1.5">{t.ticket_type}</span>
                                                    • Registered {t.registered_at ? fmtDate(t.registered_at) : '—'}
                                                </p>
                                                <a
                                                    href={t.download_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white/80 font-medium hover:bg-white/[0.12] hover:text-white transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-[11px] text-white/25 mt-6 text-center">
                                Download links are temporary and expire automatically — grab them now or re-run the search later.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </PublicLayout>
    );
}