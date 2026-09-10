import { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FlashMessage from '@/Components/FlashMessage';

const STADIUM_BG = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1920&q=80';

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
        <div className="min-h-screen flex">
            <FlashMessage />

            {/* Left - Hero / Branding */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-dark-bg">
                {/* Stadium background image */}
                <div className="absolute inset-0">
                    <img
                        src={STADIUM_BG}
                        alt=""
                        className="w-full h-full object-cover opacity-40"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 via-dark-bg/95 to-dark-bg" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/50" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/15 rounded-full blur-[200px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[180px]" />
                <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[150px]" />

                <div className="relative z-10 flex flex-col w-full h-full">
                    {/* Top header - Synergy Interface Ltd logo */}
                    <div className="flex items-center justify-between px-10 py-8">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div>
                                <span className="text-xl font-extrabold tracking-tight text-white">Event Management System</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Powered by</span>
                            <span className="text-xs font-semibold tracking-wide text-white/50">Synergy Interface Ltd.</span>
                        </div>
                    </div>

                    {/* Hero content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-10 -mt-16">
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-500/80">All-In-One Platform</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white/90 mb-1">Manage every event with confidence</h2>
                            <p className="text-xs text-white/30 tracking-wide">From registration to check-in, all in one place</p>
                        </div>

                        {/* Divider */}
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                        {/* Tagline */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-3">One Platform. Every Event.</h2>
                            <p className="text-white/40 max-w-md leading-relaxed text-sm">
                                Registrations, verifications, ticketing and check-ins — the complete Event Management System.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-10">
                            {[
                                { value: '50+', label: 'Events' },
                                { value: '10K+', label: 'Guests' },
                                { value: '4.5K+', label: 'Seats' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{stat.value}</p>
                                    <p className="text-xs text-white/20 mt-1 tracking-wide uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-white/15 text-center pb-8">
                        &copy; {new Date().getFullYear()} Synergy Interface Ltd. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dark-bg dark">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="text-left">
                                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent block leading-none">Event Management System</span>
                                <span className="text-[9px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-dark-text-secondary">By Synergy Interface Ltd.</span>
                            </div>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/15 to-primary-500/5 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Welcome back</h1>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Sign in to your Event Management System account</p>
                    </div>

                    {status && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-700 dark:text-green-300">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel value="Email" />
                            <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoComplete="username" isFocused />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <InputLabel value="Password" />
                            <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="current-password" />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-neutral-300 dark:border-dark-border text-primary-500 focus:ring-primary-500/30 focus:ring-offset-0" />
                                <span className="text-sm text-neutral-600 dark:text-dark-text-secondary group-hover:text-neutral-700 dark:group-hover:text-dark-text transition-colors">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </PrimaryButton>

                        <div className="relative">
                            <div className="divider" />
                        </div>

                        <p className="text-center text-sm text-neutral-500 dark:text-dark-text-secondary">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="font-medium text-primary-500 hover:text-primary-400 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
