import PublicAuroras from './PublicAuroras';
import PublicNavbar from './PublicNavbar';
import SiteFooter from './SiteFooter';

/**
 * Shared shell for every public-facing page (home, event browsing, guest
 * checkout, ticket tracking, sign in). No account is required. The animated
 * aurora background + sticky navbar + footer give every public page the same
 * modern, colourful, mobile-friendly chrome.
 */
export default function PublicLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-white overflow-x-clip">
            <PublicAuroras />
            <PublicNavbar />
            <main className="relative z-10 min-h-screen">{children}</main>
            <SiteFooter />
        </div>
    );
}