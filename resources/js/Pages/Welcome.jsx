import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] },
        }),
    };

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
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600
                            flex items-center justify-center shadow-lg shadow-primary-500/25
                            group-hover:shadow-xl group-hover:shadow-primary-500/35 transition-all duration-300">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">TOFFEE</span>
                            <span className="text-[9px] font-semibold tracking-widest uppercase text-primary-400/80 bg-primary-500/15 px-1.5 py-0.5 rounded ml-2">WC 2026</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={route('login')}
                            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                            Sign in
                        </Link>
                        <Link href={route('register')}
                            className="btn-primary px-5 py-2 text-sm">
                            Get started
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
                            <span className="text-xs font-medium text-white/50 tracking-wide uppercase">FIFA World Cup 2026</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} custom={1}
                            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none mb-6">
                            The Stadium<br />
                            <span className="text-gradient-primary">Is Calling</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} custom={2}
                            className="text-lg sm:text-xl text-white/30 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Toffee presents the official FIFA World Cup 2026 experience.
                            Secure your seat. Feel the energy.
                        </motion.p>

                        <motion.div variants={fadeUp} custom={3}
                            className="flex items-center justify-center gap-4 flex-wrap">
                            <Link href="/browse"
                                className="btn-primary px-8 py-3.5 text-base">
                                Browse Events
                            </Link>
                            <Link href={route('register')}
                                className="px-8 py-3.5 text-base font-medium text-white/70
                                    bg-white/[0.04] border border-white/[0.08] rounded-2xl
                                    hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5
                                    active:translate-y-0 active:scale-[0.98]
                                    transition-all duration-200">
                                Verify Now
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="grid grid-cols-3 gap-8 sm:gap-20 mt-24">
                        {[
                            { value: '50+', label: 'Events' },
                            { value: '10,000+', label: 'Fans' },
                            { value: '4,500+', label: 'Seats' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{stat.value}</p>
                                <p className="text-sm text-white/20 mt-1 tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

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
