import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const submit = (e) => { e.preventDefault(); post(route('verification.send')); };

    return (
        <GuestLayout>
            <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">Verify your email</h1>
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-6">
                    We've sent a verification link to your email address.<br />Please check your inbox and click the link.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-700 dark:text-green-300">
                        A new verification link has been sent.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Sending...' : 'Resend verification email'}
                    </PrimaryButton>
                    <Link href={route('logout')} method="post" as="button"
                        className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-dark-text-secondary dark:hover:text-dark-text transition-colors">
                        Sign out
                    </Link>
                </form>
            </div>
        </GuestLayout>
    );
}
