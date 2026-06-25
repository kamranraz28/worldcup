import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';

export default function Index({ users, filters, roles }) {
    const { auth } = usePage().props;
    const canCreate = auth.user?.permissions?.includes('users.create');
    const canEdit = auth.user?.permissions?.includes('users.edit');
    const canDelete = auth.user?.permissions?.includes('users.delete');

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">Users</h1>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                            Manage system users and their roles
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={route('admin.users.create')}
                            className="inline-flex items-center h-10 px-5 text-sm font-medium text-white
                                bg-primary-500 hover:bg-primary-400 rounded-xl transition-all duration-200
                                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New user
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
                                        User
                                    </th>
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Email
                                    </th>
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Role
                                    </th>
                                    <th className="text-left px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Status
                                    </th>
                                    <th className="text-right px-4 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-neutral-50 dark:border-dark-border 
                                            hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-colors"
                                    >
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 
                                                    flex items-center justify-center text-xs font-semibold text-primary-600">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900 dark:text-dark-text">
                                                        {user.name}
                                                    </p>
                                                    {user.phone && (
                                                        <p className="text-xs text-neutral-400">{user.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm text-neutral-600 dark:text-dark-text-secondary">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium
                                                bg-neutral-100 dark:bg-dark-elevated 
                                                text-neutral-600 dark:text-dark-text-secondary">
                                                {user.role?.display_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full 
                                                text-xs font-medium ${
                                                user.is_active
                                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300'
                                                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    user.is_active ? 'bg-green-500' : 'bg-red-500'
                                                }`} />
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <Link href={route('admin.users.edit', user.id)}
                                                        className="p-2 rounded-lg text-neutral-400 hover:text-primary-500 
                                                            hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
