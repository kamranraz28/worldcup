import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Page Not Found" />
            <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg flex items-center justify-center px-4">
                <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[700px] bg-primary-500/[0.04] rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/[0.03] rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    className="relative z-10 text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500/10 to-primary-500/5 
                            border border-primary-500/20 flex items-center justify-center mx-auto mb-8"
                    >
                        <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent mb-3">
                        404
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl font-semibold text-neutral-700 dark:text-dark-text mb-2">
                        Page not found
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-10 max-w-sm mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center justify-center gap-3">
                        <Link href="/dashboard"
                            className="btn-primary h-11 px-6 text-sm">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go to Dashboard
                        </Link>
                        <Link href="/"
                            className="btn-secondary h-11 px-6 text-sm">
                            Back to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
