import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children, size = 'md', showClose = true }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        if (open) {
            document.addEventListener('keydown', handler);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const sizeMap = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                        onClick={() => onClose?.()}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                        className={`relative w-full ${sizeMap[size] || sizeMap.md}
                            bg-white/80 dark:bg-dark-surface/90 backdrop-blur-2xl
                            rounded-2xl border border-neutral-100/80 dark:border-white/[0.06]
                            shadow-soft-xl dark:shadow-dark-xl overflow-hidden`}
                    >
                        {(title || showClose) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/[0.04]">
                                {title && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-6 rounded-full bg-primary-500" />
                                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h2>
                                    </div>
                                )}
                                {showClose && (
                                    <button
                                        onClick={() => onClose?.()}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center
                                            text-neutral-400 hover:text-neutral-600 dark:hover:text-dark-text
                                            hover:bg-neutral-100 dark:hover:bg-white/[0.04]
                                            active:scale-90 transition-all duration-150"
                                        aria-label="Close modal"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
