import { motion } from 'framer-motion';

export default function PageWrapper({ children, title, subtitle, actions, maxWidth = 'max-w-7xl' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className={`mx-auto ${maxWidth} space-y-6`}
        >
            {(title || subtitle || actions) && (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                        {title && (
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {children}
        </motion.div>
    );
}
