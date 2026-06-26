import { Link, usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-dark-bg dark flex flex-col selection:bg-primary-500/20">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[700px] h-[700px] bg-primary-500/[0.04] rounded-full blur-[150px]" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gold-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
            </div>

            <FlashMessage />

            <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600
                                flex items-center justify-center shadow-lg shadow-primary-500/25
                                group-hover:shadow-xl group-hover:shadow-primary-500/35 transition-all duration-300">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent block leading-none">
                                    TOFFEE
                                </span>
                                <span className="text-[9px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-dark-text-secondary">
                                    FIFA World Cup 2026
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="glass-card p-8">
                        {children}
                    </div>

                    <p className="text-center text-xs text-neutral-400 dark:text-dark-text-secondary mt-6">
                        &copy; {new Date().getFullYear()} Toffee. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
