import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.email')); };

    return (
        <GuestLayout>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Reset password</h1>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Enter your email and we'll send you a reset link</p>
            </div>

            {status && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-700 dark:text-green-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel value="Email" />
                    <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} isFocused autoComplete="email" />
                    <InputError message={errors.email} />
                </div>
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Sending link...' : 'Send reset link'}
                </PrimaryButton>
                <p className="text-center">
                    <Link href={route('login')} className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">Back to sign in</Link>
                </p>
            </form>
        </GuestLayout>
    );
}
