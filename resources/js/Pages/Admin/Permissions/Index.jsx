import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ permissions, filters, groups }) {
    const { auth } = usePage().props;
    const canCreate = auth.user?.permissions?.includes('roles.create');

    return (
        <AppLayout>
            <Head title="Permissions" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">
                            Permissions
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                            All permissions available in the system
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={route('admin.permissions.create')}
                            className="inline-flex items-center h-10 px-5 text-sm font-medium text-white
                                bg-primary-500 hover:bg-primary-400 rounded-xl transition-all duration-200
                                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20">
                            New permission
                        </Link>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-neutral-100 
                    dark:border-dark-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-dark-border">
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Name
                                    </th>
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Display name
                                    </th>
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Group
                                    </th>
                                    <th className="text-center px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Roles using
                                    </th>
                                    <th className="text-right px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.data.map((perm) => (
                                    <tr key={perm.id}
                                        className="border-b border-neutral-50 dark:border-dark-border 
                                            hover:bg-primary-500/[0.02] transition-colors">
                                        <td className="px-4 py-3.5">
                                            <code className="text-sm font-mono text-neutral-800 dark:text-dark-text">
                                                {perm.name}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-neutral-600 dark:text-dark-text-secondary">
                                            {perm.display_name}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium
                                                bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-text-secondary">
                                                {perm.group}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center text-sm text-neutral-500">
                                            {perm.roles_count}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link href={route('admin.permissions.edit', perm.id)}
                                                className="p-2 rounded-lg text-neutral-400 hover:text-primary-500 
                                                    hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                                                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
