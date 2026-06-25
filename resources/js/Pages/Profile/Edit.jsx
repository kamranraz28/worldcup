import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { Head } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="Profile" />

            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                        Profile
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                        Manage your account settings
                    </p>
                </div>

                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </AppLayout>
    );
}
