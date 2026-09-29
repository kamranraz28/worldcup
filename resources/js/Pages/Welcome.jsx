import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicEventCard from '../Components/Events/PublicEventCard';
import SiteFooter from '../Components/Layout/SiteFooter';

const features = [
    {
        title: 'Live Events',
        description: 'Experience the energy match day with thousands of fellow fans.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21a9 9 0 0118 0" />
            </svg>
        ),
    },
    {
        title: 'Secure Tickets',
        description: 'Book in two clicks and carry your QR pass straight to the gate.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
        ),
    },
    {
        title: 'Instant Check-in',
        description: 'One scan and you are in. No queues, no waiting, no fuss.',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
];

export default function Welcome({ featuredEvents = [], stats = {} }) {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] },
        }),
    };

    const hasEvents = featuredEvents.length > 0;

    const statValues = [
        { value: stats.events != null ? `${stats.events}+` : '50+', label: 'Events' },
        { value: stats.guests != null ? `${Number(stats.guests).toLocaleString()}+` : '10,000+', label: 'Guests' },
        { value: stats.seats != null ? `${Number(stats.seats).toLocaleString()}+` : '4,500+', label: 'Seats' },
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-gradient-to-b from-dark-bg via-[#0F0F1A] to-dark-bg overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[900px] h-[900px] bg-primary-500/[0.06] rounded-full blur-[180px]" />
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gold-500/[0.04] rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute top-2/3 right-1/3 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />

                {/* Floating particles */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -30, 0], opacity: [0, 0.08, 0] }}
                        transition={{
                            duration: 12 + Math.random() * 15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 8,
                        }}
                    />
                ))}

                {/* Nav */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                    <Link href={appUrl("/")} className="flex items-center gap-2.5 group">
                        <img src={appUrl("/ticketclub.png")} alt="TicketClub"
                            className="h-8 w-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                        <span className="text-xl font-extrabold tracking-tight text-white">TicketClub</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={appUrl("/browse")}
                            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                            Events
                        </Link>
                        <Link href={appUrl("/track-tickets")}
                            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                            Track Tickets
                        </Link>
                        <Link href={appUrl("/browse")}
                            className="btn-primary px-5 py-2 text-sm">
                            Book now
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-28 pb-32 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="max-w-4xl"
                    >
                        <motion.div variants={fadeUp} custom={0}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">TicketClub</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} custom={1}
                            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none mb-6">
                            Every Event.<br />
                            <span className="text-gradient-primary">One Platform.</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} custom={2}
                            className="text-lg sm:text-xl text-white/30 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Register, book your ticket and get in with a scan.
                            Secure your seat. Feel the energy.
                        </motion.p>

                        <motion.div variants={fadeUp} custom={3}
                            className="flex items-center justify-center gap-4 flex-wrap">
                            <Link href={appUrl("/browse")}
                                className="btn-primary px-8 py-3.5 text-base">
                                Browse Events
                            </Link>
                            <Link href={appUrl("/track-tickets")}
                                className="px-8 py-3.5 text-base font-medium text-white/70
                                    bg-white/[0.04] border border-white/[0.08] rounded-2xl
                                    hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5
                                    active:translate-y-0 active:scale-[0.98]
                                    transition-all duration-200">
                                Track My Tickets
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="grid grid-cols-3 gap-8 sm:gap-20 mt-24">
                        {statValues.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{stat.value}</p>
                                <p className="text-sm text-white/20 mt-1 tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Features */}
                <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
                    >
                        {features.map((feature, i) => (
                            <motion.div key={feature.title} variants={fadeUp} custom={i}
                                className="group p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                                    hover:bg-white/[0.05] hover:border-white/[0.1] hover:-translate-y-0.5
                                    transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
                                <p className="text-sm text-white/30 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Featured events */}
                {hasEvents && (
                    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                            className="flex items-end justify-between gap-6 mb-10"
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-5">
                                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                    <span className="text-xs font-medium text-white/50 tracking-wide uppercase">Happening Soon</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                                    Featured <span className="text-gradient-primary">Events</span>
                                </h2>
                                <p className="mt-3 text-white/30 max-w-xl">
                                    Upcoming screenings, fan zones and meetups. Secure your seat before it sells out.
                                </p>
                            </div>
                            <Link href={appUrl("/browse")}
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/70
                                    bg-white/[0.04] border border-white/[0.08] rounded-2xl
                                    hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5
                                    active:translate-y-0 active:scale-[0.98] transition-all duration-200 shrink-0"
                            >
                                View all events
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEvents.map((event, i) => (
                                <PublicEventCard key={event.uuid} event={event} index={i} />
                            ))}
                        </div>

                        <div className="flex justify-center mt-10 sm:hidden">
                            <Link href={appUrl("/browse")} className="btn-primary px-6 py-3 text-sm">
                                View all events
                            </Link>
                        </div>
                    </section>
                )}

                {/* Final CTA */}
                <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="p-10 sm:p-14 rounded-3xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                    >
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                            The stadium is calling.
                        </h2>
                        <p className="text-white/30 max-w-lg mx-auto mb-8">
                            Book your ticket in seconds — no account needed. Your pass lands in your inbox and you can track it anytime by phone.
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Link href={appUrl("/browse")} className="btn-primary px-7 py-3 text-sm">
                                Browse Events
                            </Link>
                            <Link href={appUrl("/track-tickets")}
                                className="px-7 py-3 text-sm font-medium text-white/70
                                    bg-white/[0.04] border border-white/[0.08] rounded-2xl
                                    hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5
                                    active:translate-y-0 active:scale-[0.98] transition-all duration-200">
                                Track tickets
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <SiteFooter />

                {/* Stadium curve divider */}
                <div className="relative h-40 overflow-hidden">
                    <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#FAFAFA" opacity="0.04" />
                        <path d="M0,80 C360,140 1080,20 1440,80 L1440,120 L0,120 Z" fill="#FAFAFA" opacity="0.02" />
                    </svg>
                </div>
            </div>
        </>
    );
}
