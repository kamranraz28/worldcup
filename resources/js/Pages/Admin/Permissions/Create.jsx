import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        group: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Permission" />

            <div className="max-w-xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                        Create permission
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Add a new permission to the system
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white dark:bg-dark-surface rounded-2xl border 
                    border-neutral-100 dark:border-dark-border p-6 space-y-5">
                    <div>
                        <InputLabel value="Name" />
                        <TextInput value={data.name} onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. content.publish" isFocused />
                        <p className="mt-1 text-xs text-neutral-400">Format: module.action (lowercase, dot notation)</p>
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel value="Display name" />
                        <TextInput value={data.display_name} onChange={(e) => setData('display_name', e.target.value)}
                            placeholder="e.g. Publish Content" />
                        <InputError message={errors.display_name} />
                    </div>

                    <div>
                        <InputLabel value="Group" />
                        <TextInput value={data.group} onChange={(e) => setData('group', e.target.value)}
                            placeholder="e.g. content" />
                        <InputError message={errors.group} />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-dark-border">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating...' : 'Create permission'}
                        </PrimaryButton>
                        <Link href={route('admin.permissions.index')}>
                            <SecondaryButton type="button">Cancel</SecondaryButton>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
