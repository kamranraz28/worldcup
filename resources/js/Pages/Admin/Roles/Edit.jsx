import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ role, permissions, rolePermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        display_name: role.display_name,
        description: role.description || '',
        permissions: rolePermissions,
    });

    const togglePermission = (id) => {
        const current = data.permissions;
        if (current.includes(id)) {
            setData('permissions', current.filter((p) => p !== id));
        } else {
            setData('permissions', [...current, id]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit ${role.display_name}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                        Edit role
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        {role.display_name}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border 
                        border-neutral-100 dark:border-dark-border p-6 space-y-5">
                        <div className="max-w-md">
                            <InputLabel value="Name (slug)" />
                            <TextInput value={data.name} onChange={(e) => setData('name', e.target.value)} isFocused />
                            <InputError message={errors.name} />
                        </div>

                        <div className="max-w-md">
                            <InputLabel value="Display name" />
                            <TextInput value={data.display_name} onChange={(e) => setData('display_name', e.target.value)} />
                            <InputError message={errors.display_name} />
                        </div>

                        <div className="max-w-md">
                            <InputLabel value="Description" />
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surface 
                                    border border-neutral-200 dark:border-dark-border rounded-xl
                                    text-neutral-900 dark:text-dark-text placeholder-neutral-400
                                    focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                                    resize-none"
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-surface rounded-2xl border 
                        border-neutral-100 dark:border-dark-border p-6">
                        <h2 className="text-base font-semibold text-neutral-900 dark:text-dark-text mb-1">
                            Permissions
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-5">
                            Toggle permissions for this role
                        </p>

                        <div className="space-y-6">
                            {Object.entries(permissions).map(([group, perms]) => (
                                <div key={group}>
                                    <h3 className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-3">
                                        {group}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {perms.map((perm) => (
                                            <button
                                                key={perm.id}
                                                type="button"
                                                onClick={() => togglePermission(perm.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                                                    ${data.permissions.includes(perm.id)
                                                        ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-500/10 dark:border-primary-500/30 dark:text-primary-300'
                                                        : 'bg-white dark:bg-dark-surface border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-dark-text-secondary hover:border-neutral-300'
                                                    }`}
                                            >
                                                {perm.display_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </PrimaryButton>
                        <Link href={route('admin.roles.index')}>
                            <SecondaryButton type="button">Cancel</SecondaryButton>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
