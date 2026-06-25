import { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                    Create account
                </h1>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                    Join the Toffee World Cup experience
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel value="Full name" />
                    <TextInput
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoComplete="name"
                        isFocused
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <InputLabel value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel value="Phone (optional)" />
                    <TextInput
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="+92 300 1234567"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div>
                    <InputLabel value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </div>

                <div>
                    <InputLabel value="Confirm password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : 'Create account'}
                </PrimaryButton>

                <p className="text-center text-sm text-neutral-500 dark:text-dark-text-secondary">
                    Already have an account?{' '}
                    <Link href={route('login')} className="font-medium text-primary-500 hover:text-primary-400 transition-colors">
                        Sign in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
