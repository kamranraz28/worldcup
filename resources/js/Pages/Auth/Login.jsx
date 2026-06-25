import { useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

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
        <GuestLayout>
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
        </GuestLayout>
    );
}
