export default function Footer() {
    return (
        <footer className="border-t border-neutral-100 dark:border-white/[0.04] bg-white/50 dark:bg-transparent">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 dark:text-dark-text-secondary">
                        &copy; {new Date().getFullYear()} Toffee. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-neutral-400 dark:text-dark-text-secondary">
                            FIFA World Cup 2026
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
