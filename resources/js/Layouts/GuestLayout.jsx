import { Link } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';
import PublicAuroras from '@/Components/Layout/PublicAuroras';
import PublicNavbar from '@/Components/Layout/PublicNavbar';
import SiteFooter from '@/Components/Layout/SiteFooter';

/**
 * Shell for guest-only auth screens (forgot / reset password). Same chrome as
 * every other public page, with a centered glass card for the form.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-white overflow-x-clip">
            <PublicAuroras />
            <PublicNavbar />

            <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <Link href={appUrl('/')} className="group inline-flex items-center gap-2.5">
                            <img src={appUrl('/ticketclub.png')} alt="TicketClub"
                                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
                            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-transparent">
                                TicketClub
                            </span>
                        </Link>
                    </div>

                    <FlashMessage />

                    <div className="relative rounded-3xl p-px">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary-500/40 via-white/10 to-gold-400/30" />
                        <div className="relative rounded-[calc(1.5rem-1px)] bg-white/95 dark:bg-dark-surface/90 p-6 backdrop-blur-2xl sm:p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}