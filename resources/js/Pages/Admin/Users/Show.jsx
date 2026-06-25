import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ user }) {
    return (
        <AppLayout>
            <Head title={user.name} />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.users.index')}
                        className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 
                            hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text">{user.name}</h1>
                        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">{user.email}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-neutral-100 
                    dark:border-dark-border p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Name</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-dark-text mt-1">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Email</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-dark-text mt-1">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Phone</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-dark-text mt-1">{user.phone || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Role</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-dark-text mt-1">{user.role?.display_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Status</p>
                            <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.is_active
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wide uppercase text-neutral-400">Joined</p>
                            <p className="text-sm font-medium text-neutral-900 dark:text-dark-text mt-1">
                                {user.created_at}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link href={route('admin.users.edit', user.id)}
                        className="inline-flex items-center h-10 px-5 text-sm font-medium text-white
                            bg-primary-500 hover:bg-primary-400 rounded-xl transition-all">
                        Edit user
                    </Link>
                    <Link href={route('admin.users.index')}
                        className="inline-flex items-center h-10 px-5 text-sm font-medium text-neutral-700 
                            bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                        Back to users
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
