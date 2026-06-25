import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        const msg = flash?.success || flash?.error || flash?.status;
        if (msg) {
            setMessage(msg);
            setType(flash.success ? 'success' : flash.error ? 'error' : 'info');
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, flash.success ? 4000 : flash.status ? 4000 : 6000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const config = {
        success: {
            border: 'border-green-500/20',
            bg: 'bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/15 dark:to-green-500/5',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-green-600 dark:text-green-400',
        },
        error: {
            border: 'border-red-500/20',
            bg: 'bg-gradient-to-br from-red-500/10 to-red-500/5 dark:from-red-500/15 dark:to-red-500/5',
            icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-red-600 dark:text-red-400',
        },
        info: {
            border: 'border-blue-500/20',
            bg: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/15 dark:to-blue-500/5',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-blue-600 dark:text-blue-400',
        },
    };

    const c = config[type] || config.info;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                    className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-xl border backdrop-blur-xl
                        shadow-soft-lg dark:shadow-dark-lg ${c.bg} ${c.border}`}
                    role="alert"
                >
                    <div className="flex items-center gap-2.5">
                        <svg className={`w-5 h-5 flex-shrink-0 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                        </svg>
                        <span className={`text-sm font-medium ${c.color}`}>{message}</span>
                        <button onClick={() => setVisible(false)}
                            className={`ml-auto ${c.color} opacity-60 hover:opacity-100 transition-opacity`}
                            aria-label="Dismiss">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
