import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const actions = [
    {
        label: 'Create Event',
        href: '/events/create',
        icon: 'M12 4v16m8-8H4',
        color: 'from-primary-500 to-primary-600',
        bg: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    },
    {
        label: 'New Campaign',
        href: '/campaigns/create',
        icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
        color: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
        label: 'Verify Customer',
        href: '/verifications/pending',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'from-green-500 to-green-600',
        bg: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
        label: 'View Reports',
        href: '/reports',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
];

export default function QuickActions() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {actions.map((action, i) => (
                <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                    <Link
                        href={action.href}
                        className="group relative flex flex-col items-center justify-center gap-2 p-4 h-24
                            card-premium overflow-hidden"
                    >
                        {/* Hover glow */}
                        <div className={`absolute -inset-4 bg-gradient-to-br ${action.color} opacity-0 
                            group-hover:opacity-5 blur-xl transition-opacity duration-500`} />

                        <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center ${action.bg}
                            group-hover:scale-110 transition-transform duration-200`}>
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                            </svg>
                        </div>

                        <span className="relative z-10 text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary 
                            group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {action.label}
                        </span>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
