import { motion } from 'framer-motion';

const variants = {
    primary: { from: 'from-primary-500/15', via: 'via-primary-500/5', border: 'border-primary-500/15', text: 'text-primary-500', bg: 'bg-primary-500/10' },
    green: { from: 'from-green-500/15', via: 'via-green-500/5', border: 'border-green-500/15', text: 'text-green-500', bg: 'bg-green-500/10' },
    amber: { from: 'from-amber-500/15', via: 'via-amber-500/5', border: 'border-amber-500/15', text: 'text-amber-500', bg: 'bg-amber-500/10' },
    blue: { from: 'from-blue-500/15', via: 'via-blue-500/5', border: 'border-blue-500/15', text: 'text-blue-500', bg: 'bg-blue-500/10' },
    purple: { from: 'from-purple-500/15', via: 'via-purple-500/5', border: 'border-purple-500/15', text: 'text-purple-500', bg: 'bg-purple-500/10' },
};

export default function StatCard({ label, value, variant = 'primary', icon: Icon, children }) {
    const v = variants[variant] || variants.primary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl border ${v.border} bg-gradient-to-br ${v.from} ${v.via} to-transparent backdrop-blur-2xl p-6 group`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.05] dark:from-white/[0.03] dark:to-white/[0.06]" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-400 dark:text-dark-text-secondary">{label}</span>
                    {Icon && (
                        <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center ${v.text}
                            group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{value}</span>
                    {children && <div className="text-sm">{children}</div>}
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </motion.div>
    );
}
