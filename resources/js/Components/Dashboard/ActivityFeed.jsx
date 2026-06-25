import { motion } from 'framer-motion';

const iconPaths = {
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    x: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    checkin: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    system: 'M13 10V3L4 14h7v7l9-11h-7z',
};

const iconColors = {
    verification: { verified: 'text-green-500 bg-green-50 dark:bg-green-500/10', rejected: 'text-red-500 bg-red-50 dark:bg-red-500/10', submitted: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    ticket: { purchased: 'text-primary-500 bg-primary-50 dark:bg-primary-500/10' },
    checkin: { 'checked in': 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
    system: { started: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
};

export default function ActivityFeed({ activities }) {
    return (
        <div className="relative">
            {activities.map((item, i) => {
                const defaultColor = 'text-neutral-400 bg-neutral-100 dark:bg-white/[0.04]';
                const colorClass = iconColors[item.type]?.[item.action] || defaultColor;

                return (
                    <motion.div
                        key={`${item.type}-${i}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="relative flex items-start gap-3 pb-4 last:pb-0 group"
                    >
                        {/* Timeline line */}
                        {i < activities.length - 1 && (
                            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-neutral-100 to-transparent dark:from-white/[0.04] to-transparent" />
                        )}

                        {/* Icon */}
                        <div className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}
                            group-hover:scale-110 transition-transform duration-200`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[item.icon] || iconPaths.clock} />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-sm text-neutral-900 dark:text-white">
                                <span className="font-medium">{item.subject}</span>
                                <span className="text-neutral-500 dark:text-dark-text-secondary">
                                    {' '}{item.detail}
                                </span>
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-dark-text-secondary/70 mt-0.5">
                                {item.time}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
