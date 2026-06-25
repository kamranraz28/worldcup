import GuestLayout from '@/Layouts/GuestLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({ password: '' });
    const submit = (e) => { e.preventDefault(); post(route('password.confirm')); };

    return (
        <GuestLayout>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Confirm password</h1>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">This is a secure area. Please confirm your password to continue.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel value="Password" />
                    <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} isFocused autoComplete="current-password" />
                    <InputError message={errors.password} />
                </div>
                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Confirming...' : 'Confirm'}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
