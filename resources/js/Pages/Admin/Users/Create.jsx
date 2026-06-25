import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                        Create user
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Add a new user to the platform
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white dark:bg-dark-surface rounded-2xl border 
                    border-neutral-100 dark:border-dark-border p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <InputLabel value="Name" />
                            <TextInput value={data.name} onChange={(e) => setData('name', e.target.value)} isFocused />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <InputLabel value="Email" />
                            <TextInput type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <InputLabel value="Phone" />
                            <TextInput value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <InputLabel value="Password" />
                            <TextInput type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <InputLabel value="Confirm password" />
                            <TextInput type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div>
                            <InputLabel value="Role" />
                            <select
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
                                className="w-full h-10 px-4 text-sm bg-white dark:bg-dark-surface 
                                    border border-neutral-200 dark:border-dark-border rounded-xl
                                    text-neutral-900 dark:text-dark-text
                                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                            >
                                <option value="">Select role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.display_name}</option>
                                ))}
                            </select>
                            <InputError message={errors.role_id} />
                        </div>

                        <div>
                            <label className="flex items-center gap-3 mt-8 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded border-neutral-300 text-primary-500 
                                        focus:ring-primary-500/30"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-dark-text-secondary">
                                    Active
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating...' : 'Create user'}
                        </PrimaryButton>
                        <Link href={route('admin.users.index')}>
                            <SecondaryButton type="button">Cancel</SecondaryButton>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
