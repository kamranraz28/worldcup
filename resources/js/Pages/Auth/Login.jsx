import { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import FlashMessage from '@/Components/FlashMessage';

const STADIUM_BG = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1920&q=80';
const BANGALALINK_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Banglalink_Logo_2025.svg';

const players = [
    {
        name: 'Messi',
        country: 'Argentina',
        number: '10',
        flag: ['#75AADB', '#FFFFFF'],
        shadowColor: 'rgba(117, 170, 219, 0.4)',
        pose: 'kicking',
    },
    {
        name: 'Ronaldo',
        country: 'Portugal',
        number: '7',
        flag: ['#006600', '#FF0000'],
        shadowColor: 'rgba(255, 0, 0, 0.4)',
        pose: 'celebrate',
    },
    {
        name: 'Mbappé',
        country: 'France',
        number: '10',
        flag: ['#002395', '#FFFFFF', '#ED2939'],
        shadowColor: 'rgba(0, 35, 149, 0.4)',
        pose: 'sprint',
    },
];

function PlayerSilhouette({ pose }) {
    if (pose === 'kicking') {
        return (
            <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="18" r="10" fill="currentColor" />
                <path d="M40 30 L40 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 38 L18 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M40 38 L62 30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M40 65 L30 105 L25 115" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 65 L55 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="63" cy="88" r="6" stroke="currentColor" strokeWidth="3" />
            </svg>
        );
    }
    if (pose === 'celebrate') {
        return (
            <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="18" r="10" fill="currentColor" />
                <path d="M40 30 L40 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 38 L15 25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M40 38 L65 25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M40 65 L30 105 L25 115" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 65 L50 105 L55 115" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="18" r="10" fill="currentColor" />
            <path d="M40 30 L40 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M40 38 L55 28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M40 38 L25 48" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M40 65 L55 95 L60 110" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 65 L25 95 L20 110" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlayerCard({ player, index }) {
    return (
        <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                <div
                    className="w-20 h-28 flex items-center justify-center text-white/80 group-hover:text-white transition-colors duration-300"
                    style={{ filter: `drop-shadow(0 0 12px ${player.shadowColor})` }}
                >
                    <PlayerSilhouette pose={player.pose} />
                </div>
                <div className="flex items-center gap-1.5">
                    {player.flag.map((color, i) => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                </div>
                <span className="text-sm font-bold text-white/90 tracking-wide">{player.name}</span>
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">{player.country}</span>
            </div>
        </div>
    );
}

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
                    {/* Top header - Toffee & Banglalink logos */}
                    <div className="flex items-center justify-between px-10 py-8">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-xl font-extrabold tracking-tight text-white">TOFFEE</span>
                                <span className="text-[9px] font-semibold tracking-widest uppercase text-primary-400/80 ml-2">WC 2026</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">Powered by</span>
                            <img
                                src={BANGALALINK_LOGO}
                                alt="Banglalink"
                                className="h-5 brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>

                    {/* Hero content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-10 -mt-16">
                        {/* Star Players Section */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-500/80">WC 2026 Stars</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white/90 mb-1">Meet the Legends</h2>
                            <p className="text-xs text-white/30 tracking-wide">Football's finest grace the biggest stage</p>
                        </div>

                        <div className="flex items-center justify-center gap-6 mb-10">
                            {players.map((player, index) => (
                                <PlayerCard key={player.name} player={player} index={index} />
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                        {/* Tagline */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-3">The World Is Watching</h2>
                            <p className="text-white/40 max-w-md leading-relaxed text-sm">
                                Experience the thrill of the FIFA World Cup 2026. Secure your seat, manage your check-ins, and be part of history.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-10">
                            {[
                                { value: '50+', label: 'Events' },
                                { value: '10K+', label: 'Fans' },
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
                        &copy; {new Date().getFullYear()} Toffee × Banglalink. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dark-bg dark">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent block leading-none">TOFFEE</span>
                                <span className="text-[9px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-dark-text-secondary">FIFA World Cup 2026</span>
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
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Sign in to your Toffee World Cup account</p>
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
