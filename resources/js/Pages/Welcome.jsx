import { Link, Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import PublicEventCard from '../Components/Events/PublicEventCard';
import PublicAuroras from '../Components/Layout/PublicAuroras';
import PublicNavbar from '../Components/Layout/PublicNavbar';
import SiteFooter from '../Components/Layout/SiteFooter';

/* ────────────────────────────────────────────────────────────────
   Animations & shared motion variants
──────────────────────────────────────────────────────────────── */
const easeOut = [0.22, 1, 0.36, 1];

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: easeOut } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
};

function SectionHeading({ eyebrow, title, accent, sub, center = false }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={container}
            className={center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}
        >
            <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-1.5 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600 dark:text-white/60">{eyebrow}</span>
            </motion.div>

            <motion.h2 variants={fadeUp}
                className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {title}{' '}
                <span className="bg-gradient-to-r from-primary-400 via-gold-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                    {accent}
                </span>
            </motion.h2>

            {sub && (
                <motion.p variants={fadeUp} className="mt-4 text-base text-neutral-500 dark:text-white/40 leading-relaxed">{sub}</motion.p>
            )}
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Animated number counter (fires when scrolled into view)
──────────────────────────────────────────────────────────────── */
function CountUp({ value, suffix = '', className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf;
        const start = performance.now();
        const duration = 1600;
        const tick = (t) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value]);

    return (
        <span ref={ref} className={className}>
            {display.toLocaleString()}{suffix}
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────
   Ambient background handled by PublicAuroras (shared component)
──────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────
   Floating "ticket" mockups used in the hero
──────────────────────────────────────────────────────────────── */
const TICKETS = [
    { label: 'CONCERT', title: 'Stadium Night', meta: '12 Oct · 7:00 PM', price: 'BDT 499', className: 'left-[3%] top-24 rotate-[-8deg]', accent: 'from-primary-500 to-primary-400', delay: '0s' },
    { label: 'FESTIVAL', title: 'Fan Zone Gala', meta: '20 Oct · 6:30 PM', price: 'BDT 299', className: 'right-[4%] top-40 rotate-[7deg]', accent: 'from-gold-400 to-amber-500', delay: '1.4s' },
    { label: 'VIRTUAL', title: 'Night Live Watch', meta: '28 Oct · 9:00 PM', price: 'Free', className: 'left-[8%] bottom-32 rotate-[5deg]', accent: 'from-blue-400 to-cyan-400', delay: '2.6s' },
];

function TicketMock({ label, title, meta, price, className, accent, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: +delay || 0.9, duration: 0.8, ease: easeOut }}
            className={`absolute hidden lg:block ${className}`}
        >
            <div className="w-56 rounded-2xl border border-white/10 bg-[#0D0D14]/85 p-4 shadow-2xl backdrop-blur-xl animate-float"
                style={{ animationDelay: delay, animationDuration: '7s' }}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/40">{label}</p>
                        <p className="mt-1.5 text-sm font-bold text-white">{title}</p>
                    </div>
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${accent} p-1 shadow-lg`}>
                        <div className="h-full w-full rounded-md bg-black/20 bg-dots" />
                    </div>
                </div>

                <div className="relative my-3 border-t border-dashed border-white/15">
                    <span className="absolute -left-6 -top-[5px] h-2 w-2 rounded-full bg-black border border-white/10" />
                    <span className="absolute -right-6 -top-[5px] h-2 w-2 rounded-full bg-black border border-white/10" />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40">{meta}</span>
                    <span className="text-sm font-extrabold text-white">{price}</span>
                </div>
            </div>
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Shared navbar lives in Components/Layout/PublicNavbar
──────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────
   Category chips
──────────────────────────────────────────────────────────────── */
const CATEGORIES = [
    { label: 'All Events', emoji: '🎟️', href: appUrl('/browse'), classes: 'from-primary-500/90 to-primary-600/90' },
    { label: 'Live Concerts', emoji: '🎤', href: appUrl('/browse?event_type=live'), classes: 'from-gold-400 to-amber-500' },
    { label: 'Virtual Talks', emoji: '💻', href: appUrl('/browse?event_type=virtual'), classes: 'from-blue-400 to-cyan-400' },
    { label: 'Hybrid Meetups', emoji: '🌐', href: appUrl('/browse?event_type=hybrid'), classes: 'from-green-400 to-emerald-500' },
    { label: 'Sports Zone', emoji: '⚽', href: appUrl('/browse?search=sport'), classes: 'from-fuchsia-400 to-purple-500' },
    { label: 'Festivals', emoji: '🎪', href: appUrl('/browse?search=festival'), classes: 'from-orange-400 to-rose-500' },
];

/* ────────────────────────────────────────────────────────────────
   Marquee strip
──────────────────────────────────────────────────────────────── */
const MARQUEE = [
    'LIVE CONCERTS', 'E-SPORTS', 'FESTIVALS', 'FAN ZONES', 'WORKSHOPS', 'VIP LOUNGES',
    'CONFERENCES', 'MIDNIGHT SHOWS', 'MEET-UP GATES', 'EARLY BIRD DEALS',
];

/* ────────────────────────────────────────────────────────────────
   Features / bento grid
──────────────────────────────────────────────────────────────── */
const FEATURES = [
    {
        title: 'Secure Tickets',
        desc: 'Book in two clicks — your QR pass lands straight in your inbox.',
        icon: '🎫',
        gradient: 'from-primary-500 to-rose-500',
        span: 'sm:col-span-2',
    },
    {
        title: 'Instant Check-in',
        desc: 'One scan at the gate and you are in. No queues.',
        icon: '⚡',
        gradient: 'from-gold-400 to-amber-500',
        span: '',
    },
    {
        title: 'Multiple Payments',
        desc: 'bKash, Nagad, cards and more — secure checkout end to end.',
        icon: '💳',
        gradient: 'from-blue-400 to-cyan-400',
        span: '',
    },
    {
        title: 'Track your tickets',
        desc: 'Lost the email? Find any ticket with just your phone number.',
        icon: '🔍',
        gradient: 'from-green-400 to-emerald-500',
        span: '',
    },
    {
        title: 'Real-time dashboard',
        desc: 'Organisers get live sales, scanning and attendance analytics.',
        icon: '📊',
        gradient: 'from-fuchsia-400 to-purple-500',
        span: 'sm:col-span-2',
    },
];

/* ────────────────────────────────────────────────────────────────
   How it works steps
──────────────────────────────────────────────────────────────── */
const STEPS = [
    {
        n: '01',
        title: 'Pick your event',
        desc: 'Browse live, virtual and hybrid events happening near you.',
        emoji: '🧭',
        gradient: 'from-primary-500 to-rose-500',
    },
    {
        n: '02',
        title: 'Book & pay',
        desc: 'Choose your spot, pay securely, get your QR pass by email.',
        emoji: '💳',
        gradient: 'from-gold-400 to-amber-500',
    },
    {
        n: '03',
        title: 'Scan at the gate',
        desc: 'Show your pass and walk straight in. That simple.',
        emoji: '✅',
        gradient: 'from-blue-400 to-cyan-400',
    },
];

/* ────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────── */
export default function Welcome({ featuredEvents = [], stats = {} }) {
    const { scrollY } = useScroll();
    const heroTextY = useTransform(scrollY, [0, 500], [0, 90]);
    const heroOpacity = useTransform(scrollY, [0, 420], [1, 0.25]);

    const statItems = [
        { value: stats.events != null ? Number(stats.events) : 0, fallback: 50, suffix: '+', label: 'Events', from: 'from-primary-400 to-rose-400' },
        { value: stats.guests != null ? Number(stats.guests) : 0, fallback: 10000, suffix: '+', label: 'Guests', from: 'from-gold-400 to-amber-400' },
        { value: stats.seats != null ? Number(stats.seats) : 0, fallback: 4500, suffix: '+', label: 'Seats', from: 'from-green-400 to-emerald-400' },
    ];

    const hasEvents = featuredEvents.length > 0;
    const displayedStats = statItems.map((s) => ({ ...s, value: s.value || s.fallback }));

    return (
        <>
            <Head title="TicketClub — Live Events, Concerts & More" />
            <div className="relative min-h-screen bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-white overflow-x-clip">
                <PublicAuroras />
                <PublicNavbar />

                {/* ═══════════════ HERO ═══════════════ */}
                <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
                    {TICKETS.map((t) => (
                        <TicketMock key={t.title} {...t} />
                    ))}

                    <motion.div style={{ y: heroTextY, opacity: heroOpacity }}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="relative mx-auto max-w-4xl text-center"
                    >
                        {/* Live badge */}
                        <motion.div variants={scaleIn}
                            className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-2 backdrop-blur">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 dark:text-white/70">
                                Booking is open
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeUp}
                            className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            Your seat to every
                            <span className="mt-1 block bg-gradient-to-r from-primary-400 via-gold-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                                big moment.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeUp}
                            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-white/45 sm:text-lg">
                            Concerts, festivals, live watch parties — book your pass in seconds, pay the way you like,
                            and walk straight in with a scan. No account needed.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp}
                            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <Link href={appUrl('/browse')}
                                className="btn-primary w-full px-8 py-4 text-base sm:w-auto sm:px-10 shadow-glow-primary">
                                Browse Events
                                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link href={appUrl('/track-tickets')}
                                className="btn-secondary w-full px-8 py-4 text-base sm:w-auto sm:px-10">
                                Track My Tickets
                            </Link>
                        </motion.div>

                        {/* Trust row */}
                        <motion.div variants={fadeIn}
                            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400 dark:text-white/35">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Instant QR delivery
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Secure payments
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> No queues at the gate
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Stats band */}
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
                        className="relative z-10 mt-14 grid w-full max-w-3xl grid-cols-3 gap-3 sm:mt-20 sm:gap-5"
                    >
                        {displayedStats.map((s) => (
                            <div key={s.label}
                                className="group rounded-2xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-white/15 sm:p-6">
                                <p className={`bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-white/50 bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl`}>
                                    <CountUp value={s.value} suffix={s.suffix} />
                                </p>
                                <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-white/35 sm:text-xs">
                                    {s.label}
                                </p>
                                <span className={`mx-auto mt-2 block h-1 w-8 rounded-full bg-gradient-to-r ${s.from} opacity-70 transition-all duration-300 group-hover:w-14`} />
                            </div>
                        ))}
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
                    >
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 dark:text-white/25">Scroll</span>
                        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
                            <motion.span
                                className="h-2 w-1 rounded-full bg-gold-400"
                                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </span>
                    </motion.div>
                </section>

                {/* ═══════════════ MARQUEE ═══════════════ */}
                <div className="relative z-10 border-y border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02] py-4 backdrop-blur">
                    <div className="overflow-hidden">
                        <div className="flex w-max animate-marquee whitespace-nowrap">
                            {[...MARQUEE, ...MARQUEE].map((word, i) => (
                                <span key={i}
                                    className="mx-6 inline-flex items-center gap-6 text-sm font-extrabold uppercase tracking-[0.3em] text-neutral-400 dark:text-white/25">
                                    {word}
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500/70" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════ CATEGORIES ═══════════════ */}
                <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
                    <SectionHeading
                        eyebrow="Find your vibe"
                        title="Explore by"
                        accent="category"
                        sub="Jump straight to the kind of experience you are looking for."
                    />

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={container}
                        className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
                    >
                        {CATEGORIES.map((c) => (
                            <motion.a key={c.label} variants={scaleIn} href={c.href}
                                whileHover={{ y: -6, scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="group inline-flex items-center gap-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-5 py-3.5 backdrop-blur transition-colors hover:border-neutral-300 dark:hover:border-white/20"
                            >
                                <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.classes} text-lg shadow-lg`}>
                                    {c.emoji}
                                </span>
                                <span className="text-sm font-semibold text-neutral-800/90 dark:text-white/85 group-hover:text-neutral-900 dark:hover:text-white">{c.label}</span>
                            </motion.a>
                        ))}
                    </motion.div>
                </section>

                {/* ═══════════════ FEATURED EVENTS ═══════════════ */}
                <section id="events" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={container}
                        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
                    >
                        <div>
                            <SectionHeading eyebrow="Happening soon" title="Featured" accent="events" />
                        </div>
                        <motion.div variants={fadeUp} className="shrink-0">
                            <Link href={appUrl('/browse')}
                                className="hidden items-center gap-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-5 py-3 text-sm font-medium text-neutral-700 dark:text-white/70 transition-colors hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white sm:inline-flex">
                                View all events
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {hasEvents ? (
                        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-thin sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
                            {featuredEvents.map((event, i) => (
                                <div key={event.uuid} className="min-w-[280px] snap-start sm:min-w-0">
                                    <PublicEventCard event={event} index={i} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={fadeUp}
                            className="mt-10 rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] p-12 text-center">
                            <p className="text-4xl">🎟️</p>
                            <p className="mt-3 text-lg font-semibold text-neutral-800 dark:text-white/80">Events are being lined up</p>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-white/40">Check back soon — new dates land all the time.</p>
                        </motion.div>
                    )}

                    <div className="mt-8 sm:hidden">
                        <Link href={appUrl('/browse')} className="btn-primary w-full px-6 py-3.5 text-sm">
                            View all events
                        </Link>
                    </div>
                </section>

                {/* ═══════════════ HOW IT WORKS ═══════════════ */}
                <section id="how" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
                    <SectionHeading
                        eyebrow="Simple by design"
                        title="How it"
                        accent="works"
                        sub="Three steps between you and the energy."
                        center
                    />

                    <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
                        {/* connector line (desktop) */}
                        <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-primary-500/40 via-gold-400/40 to-blue-400/40 sm:block" />

                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.n}
                                initial={{ opacity: 0, y: 34 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: i * 0.12, duration: 0.6, ease: easeOut }}
                                className="group relative text-center"
                            >
                                <div className="relative mx-auto flex h-18 w-18 items-center justify-center">
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-50`} />
                                    <div className={`relative flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}>
                                        {step.emoji}
                                    </div>
                                </div>
                                <p className="mt-6 bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60 bg-clip-text text-2xl font-extrabold text-transparent">
                                    {step.n}
                                </p>
                                <h3 className="mt-1.5 text-lg font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-white/40">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════ FEATURES (bento) ═══════════════ */}
                <section id="features" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6">
                    <SectionHeading
                        eyebrow="Everything included"
                        title="Built for the"
                        accent="whole journey"
                        sub="From browsing to the gate — one smooth flow for fans and organisers."
                    />

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={container}
                        className="mt-12 grid gap-5 sm:grid-cols-3"
                    >
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-7 backdrop-blur transition-colors hover:border-neutral-300 dark:hover:border-white/15 ${f.span}`}
                            >
                                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-25`} />
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-2xl shadow-lg`}>
                                    {f.icon}
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-neutral-900 dark:text-white">{f.title}</h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-white/40">{f.desc}</p>
                                <span className={`mt-5 block h-1 w-8 rounded-full bg-gradient-to-r ${f.gradient} transition-all duration-300 group-hover:w-16`} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ═══════════════ CTA BANNER ═══════════════ */}
                <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.7, ease: easeOut }}
                        className="relative overflow-hidden rounded-[2rem] p-px"
                    >
                        {/* animated gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-gold-400 to-blue-500 animate-gradient-x bg-[length:200%_auto] opacity-80" />

                        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-white dark:bg-dark-surface px-6 py-14 text-center sm:px-14 sm:py-16">
                            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl" />
                                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />
                                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
                            </div>

                            <div className="relative">
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-5xl sm:text-6xl"
                                >
                                    🎶
                                </motion.p>
                                <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                                    Don't just watch it.{' '}
                                    <span className="bg-gradient-to-r from-gold-400 via-amber-300 to-primary-400 bg-clip-text text-transparent">
                                        Be there.
                                    </span>
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500 dark:text-white/40">
                                    Your pass is one tap away. Grab it now — the best seats go first.
                                </p>
                                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                                    <Link href={appUrl('/browse')}
                                        className="btn-primary w-full px-9 py-4 text-base sm:w-auto shadow-glow-gold">
                                        Get your pass
                                    </Link>
                                    <Link href={appUrl('/track-tickets')}
                                        className="btn-secondary w-full px-9 py-4 text-base sm:w-auto">
                                        Find my tickets
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <SiteFooter />
            </div>
        </>
    );
}