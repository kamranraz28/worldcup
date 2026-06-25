import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { motion } from 'framer-motion';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <section className="bg-white dark:bg-dark-surface rounded-2xl border border-neutral-100 
                dark:border-dark-border p-6">
                <header className="mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text">
                        Profile information
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Update your account details
                    </p>
                </header>

                <form onSubmit={submit} className="space-y-5">
                    <div className="max-w-md">
                        <InputLabel value="Name" />
                        <TextInput
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            isFocused
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="max-w-md">
                        <InputLabel value="Email" />
                        <TextInput
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="max-w-md">
                        <InputLabel value="Phone" />
                        <TextInput
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            autoComplete="tel"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 
                            border border-amber-200 dark:border-amber-500/20">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Your email address is unverified.{' '}
                                <button
                                    onClick={() => post(route('verification.send'))}
                                    className="underline font-medium hover:text-amber-800 transition-colors"
                                >
                                    Click here to re-send the verification email.
                                </button>
                            </p>
                            {status === 'verification-link-sent' && (
                                <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
                                    A new verification link has been sent to your email.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        {recentlySuccessful && (
                            <span className="text-sm text-green-600 dark:text-green-400">Saved.</span>
                        )}
                    </div>
                </form>
            </section>
        </motion.div>
    );
}
