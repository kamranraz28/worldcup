export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-neutral-100 dark:border-white/[0.04] bg-white/50 dark:bg-transparent">
            <div className="px-6 py-5">
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <a
                        href="https://synergyinterface.com/web/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-2xl border border-gold-500/20
                            bg-gradient-to-r from-primary-500/[0.05] via-white/40 to-gold-500/[0.08]
                            dark:from-primary-500/[0.06] dark:via-transparent dark:to-gold-500/[0.1]
                            px-3.5 py-2 transition-all duration-200 hover:border-gold-500/40 hover:-translate-y-0.5"
                    >
                        <img
                            src={appUrl("/synergy.png")}
                            alt="Synergy Interface Ltd"
                            className="h-6 w-auto"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(255,213,79,0.35))' }}
                        />
                        <p className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary">
                            &copy; {year} Synergy Interface Ltd. All rights reserved.
                        </p>
                    </a>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold tracking-wide text-neutral-500 dark:text-dark-text-secondary">
                            TicketClub
                        </span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-dark-border" />
                        <span className="text-xs text-neutral-400 dark:text-dark-text-secondary">
                            v1.0.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}