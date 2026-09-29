import { Link, Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicLayout from '../../Components/Layout/PublicLayout';

export default function PaymentFailed() {
    const { flash } = usePage().props;

    return (
        <PublicLayout>
            <Head title="Payment Incomplete" />
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 mx-auto rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-6"
                    >
                        <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Payment not completed</h1>
                    <p className="mt-3 text-neutral-500 dark:text-white/40">
                        {flash?.error || 'Your payment could not be completed. As promised, no reservation was kept.'}
                    </p>
                    <p className="mt-2 text-sm text-neutral-400 dark:text-white/25">
                        You can simply try again — nothing from this attempt remains in the system.
                    </p>

                    <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
                        <Link href={appUrl('/browse')} className="btn-primary px-7 py-3 text-sm">
                            Browse events
                        </Link>
                        <Link href={appUrl('/track-tickets')} className="px-6 py-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-sm font-medium text-neutral-700 dark:text-white/70 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all">
                            Track tickets
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}