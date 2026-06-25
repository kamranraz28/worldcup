import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token, email, password: '', password_confirmation: '',
    });
    const submit = (e) => { e.preventDefault(); post(route('password.store')); };

    return (
        <GuestLayout>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Set new password</h1>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Choose a strong password for your account</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel value="Email" />
                    <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} isFocused autoComplete="username" />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <InputLabel value="Password" />
                    <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} autoComplete="new-password" />
                    <InputError message={errors.password} />
                </div>
                <div>
                    <InputLabel value="Confirm password" />
                    <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} autoComplete="new-password" />
                    <InputError message={errors.password_confirmation} />
                </div>
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Resetting...' : 'Reset password'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
