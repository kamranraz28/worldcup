import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const counter = (target, suffix = '') => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => {
        if (target % 1 !== 0) return v.toFixed(1) + suffix;
        return Math.round(v).toLocaleString() + suffix;
    });

    useEffect(() => {
        const controls = animate(count, target, {
            duration: 1.2,
            ease: [0.25, 1, 0.5, 1],
        });
        return controls.stop;
    }, [target]);

    return rounded;
};

function CounterValue({ value, suffix = '' }) {
    const rounded = counter(value, suffix);
    return <motion.span>{rounded}</motion.span>;
}

export default function StatCard({ label, value, change, direction, suffix = '', icon, color = 'primary' }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const colorMap = {
        primary: 'from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400',
        green: 'from-green-500/20 to-green-600/10 text-green-600 dark:text-green-400',
        amber: 'from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400',
        blue: 'from-blue-500/20 to-blue-600/10 text-blue-600 dark:text-blue-400',
        purple: 'from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400',
    };

    const borderMap = {
        primary: 'border-primary-500/20 dark:border-primary-500/10',
        green: 'border-green-500/20 dark:border-green-500/10',
        amber: 'border-amber-500/20 dark:border-amber-500/10',
        blue: 'border-blue-500/20 dark:border-blue-500/10',
        purple: 'border-purple-500/20 dark:border-purple-500/10',
    };

    const cm = colorMap[color] || colorMap.primary;
    const bm = borderMap[color] || borderMap.primary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="group relative bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl
                rounded-2xl border border-neutral-100/80 dark:border-white/[0.04] p-5 overflow-hidden
                hover:shadow-soft-lg dark:hover:shadow-dark-lg
                transition-all duration-300"
        >
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${cm.split(' ')[0]}
                opacity-0 group-hover:opacity-100 rounded-full blur-3xl transition-opacity duration-500`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium tracking-wide text-neutral-400 dark:text-dark-text-secondary uppercase">
                        {label}
                    </span>
                    {icon && (
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cm} flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300`}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {mounted ? (
                            <CounterValue value={value || 0} suffix={suffix} />
                        ) : (
                            <span className="text-neutral-300 dark:text-dark-border">&mdash;</span>
                        )}
                    </span>

                    {change !== undefined && change !== null && (
                        <span className={`inline-flex items-center gap-0.5 text-sm font-medium
                            ${direction === 'up'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}>
                            <svg className={`w-3.5 h-3.5 ${direction === 'down' ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            {Math.abs(change)}%
                        </span>
                    )}
                </div>
            </div>

            <div className={`absolute bottom-3 right-3 w-16 h-16 rounded-full bg-gradient-to-br ${cm.split(' ')[0]}
                opacity-20 dark:opacity-10 blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:opacity-30`} />
        </motion.div>
    );
}
