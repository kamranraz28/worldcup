import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { motion } from 'framer-motion';

export default function Index({ roles, filters }) {
    const { auth } = usePage().props;
    const canCreate = auth.user?.permissions?.includes('roles.create');

    return (
        <AppLayout>
            <Head title="Roles" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">Roles</h1>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
                            Manage user roles and permissions
                        </p>
                    </div>
                    {canCreate && (
                        <Link href={route('admin.roles.create')}
                            className="inline-flex items-center h-10 px-5 text-sm font-medium text-white
                                bg-primary-500 hover:bg-primary-400 rounded-xl transition-all duration-200
                                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New role
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.data.map((role, i) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-dark-surface rounded-2xl border 
                                border-neutral-100 dark:border-dark-border p-5
                                hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-semibold text-neutral-900 dark:text-dark-text">
                                    {role.display_name}
                                </h3>
                                {role.is_system && (
                                    <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 
                                        rounded-md bg-neutral-100 dark:bg-dark-elevated text-neutral-400">
                                        System
                                    </span>
                                )}
                            </div>
                            {role.description && (
                                <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mb-4">
                                    {role.description}
                                </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                <span>{role.users_count} users</span>
                                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                <span>{role.permissions_count} permissions</span>
                            </div>
                            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-dark-border">
                                <Link
                                    href={route('admin.roles.edit', role.id)}
                                    className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors"
                                >
                                    Edit role →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
