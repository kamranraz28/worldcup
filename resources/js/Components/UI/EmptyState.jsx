import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action, compact = false }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-20'}`}
        >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-dark-muted border border-neutral-200 dark:border-dark-border
                flex items-center justify-center mb-5">
                {icon || (
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                )}
            </div>

            <h3 className={`font-semibold text-neutral-900 dark:text-white mb-1.5 ${compact ? 'text-sm' : 'text-xl'}`}>
                {title || 'Nothing here yet'}
            </h3>

            {description && (
                <p className={`text-neutral-500 dark:text-dark-text-secondary max-w-sm ${compact ? 'text-xs' : 'text-sm'}`}>
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </motion.div>
    );
}
