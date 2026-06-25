import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { motion } from 'framer-motion';

export default function UpdatePasswordForm() {
    const { data, setData, put, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <section className="bg-white dark:bg-dark-surface rounded-2xl border border-neutral-100 
                dark:border-dark-border p-6">
                <header className="mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text">
                        Update password
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Ensure your account is using a strong password
                    </p>
                </header>

                <form onSubmit={submit} className="space-y-5">
                    <div className="max-w-md">
                        <InputLabel value="Current password" />
                        <TextInput
                            type="password"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            autoComplete="current-password"
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    <div className="max-w-md">
                        <InputLabel value="New password" />
                        <TextInput
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="max-w-md">
                        <InputLabel value="Confirm new password" />
                        <TextInput
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

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
