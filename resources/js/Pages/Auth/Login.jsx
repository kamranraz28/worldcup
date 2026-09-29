import { useEffect } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import FlashMessage from '@/Components/FlashMessage';
import PublicLayout from '../../Components/Layout/PublicLayout';

const easeOut = [0.22, 1, 0.36, 1];

// The public site is dark by default, so fields carry explicit dark colours.
const FIELD_CLASSES = '!bg-white !border-neutral-300 !text-neutral-900 !placeholder-neutral-400 dark:!bg-dark-surface dark:!border-dark-border dark:!text-dark-text dark:!placeholder-dark-text-secondary';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <PublicLayout>
            <Head title="Staff Sign In" />
            <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
                <FlashMessage />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
                        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 dark:border-white/10 bg-gradient-to-br from-primary-500/15 to-gold-400/10 shadow-glow-primary"
                    >
                        <svg className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
                        className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.05] px-4 py-1.5 backdrop-blur"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600 dark:text-white/60">Staff sign in</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
                        className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
                    >
                        Welcome{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-gold-400 to-blue-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                            back
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-2 text-sm text-neutral-500 dark:text-white/40"
                    >
                        Sign in to the TicketClub control panel
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6, ease: easeOut }}
                    className="relative rounded-3xl p-px"
                >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary-500/40 via-white/10 to-gold-400/30" />

                    <div className="relative rounded-[calc(1.5rem-1px)] bg-white/95 dark:bg-dark-surface/90 p-6 sm:p-8 backdrop-blur-2xl">
                        {status && (
                            <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel value="Email" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="username" isFocused className={FIELD_CLASSES} />
                                <InputError message={errors.email} className="!text-red-400" />
                            </div>

                            <div>
                                <InputLabel value="Password" className="!text-neutral-800 dark:!text-dark-text !text-sm" />
                                <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="current-password" className={FIELD_CLASSES} />
                                <InputError message={errors.password} className="!text-red-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="group flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-dark-border bg-white dark:bg-dark-elevated text-primary-500 focus:ring-primary-500/30 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-neutral-500 dark:text-white/50 transition-colors group-hover:text-neutral-900 dark:hover:text-white/80">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm font-medium text-primary-400 transition-colors hover:text-primary-300">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={processing}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary w-full h-12 justify-center disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Signing in…
                                    </span>
                                ) : 'Sign in'}
                            </motion.button>
                        </form>

                        <p className="mt-6 text-center text-xs text-neutral-400 dark:text-white/25">
                            This area is for event staff and administrators.
                        </p>
                    </div>
                </motion.div>
            </div>
        </PublicLayout>
    );
}