import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { motion } from 'framer-motion';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, errors, reset } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
        setTimeout(() => passwordInput.current?.focus(), 250);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <section className="bg-white dark:bg-dark-surface rounded-2xl border border-red-100 
                dark:border-red-500/10 p-6">
                <header className="mb-6">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                        Delete account
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Once your account is deleted, all resources and data will be permanently removed
                    </p>
                </header>

                <DangerButton onClick={confirmUserDeletion}>
                    Delete account
                </DangerButton>
            </section>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-xl 
                            border border-neutral-100 dark:border-dark-border p-6 w-full max-w-md"
                    >
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text mb-2">
                            Are you sure?
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-6">
                            This action cannot be undone. Please enter your password to confirm.
                        </p>

                        <form onSubmit={deleteUser} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    ref={passwordInput}
                                    className="w-full h-10 px-4 text-sm bg-white dark:bg-dark-surface 
                                        border border-neutral-200 dark:border-dark-border rounded-xl
                                        text-neutral-900 dark:text-dark-text
                                        focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <SecondaryButton type="button" onClick={closeModal}>
                                    Cancel
                                </SecondaryButton>
                                <DangerButton disabled={processing}>
                                    {processing ? 'Deleting...' : 'Delete account'}
                                </DangerButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
