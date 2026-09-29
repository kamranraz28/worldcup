import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

import AppLayout from '@/Layouts/AppLayout';

const ICONS = {
  verification_approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  verification_rejected: 'M10 14l2-2m0 0l2-2m-2 2l-2 2m4-6a9 9 0 11-18 0 9 9 0 0118 0z',
  ticket_confirmed: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  event_reminder: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  check_in: 'M5 12l5 5L20 7',
  payment: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  campaign: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.123A3 3 0 006 19.5',
};

const TONES = {
  verification_approved: 'bg-green-500/10 text-green-400',
  verification_rejected: 'bg-red-500/10 text-red-400',
  ticket_confirmed: 'bg-primary-500/10 text-primary-500',
  event_reminder: 'bg-blue-500/10 text-blue-400',
  check_in: 'bg-purple-500/10 text-purple-400',
  payment: 'bg-amber-500/10 text-amber-400',
  campaign: 'bg-cyan-500/10 text-cyan-400',
};

const iconFor = (type) => ICONS[type] || ICONS.event_reminder;
const toneFor = (type) => TONES[type] || TONES.event_reminder;

const fmtDate = (d) => new Date(d).toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function Index({ notifications }) {
  const unreadCount = usePage().props.unreadCount ?? 0;
  const [busy, setBusy] = useState(false);

  const markAllRead = () => {
    if (busy || unreadCount === 0) return;
    setBusy(true);
    router.post(appUrl('/notifications/read-all'), {}, {
      preserveScroll: true,
      onFinish: () => setBusy(false),
    });
  };

  const markRead = (id) => {
    if (busy) return;
    setBusy(true);
    router.post(appUrl(`/notifications/${id}/read`), {}, {
      preserveScroll: true,
      onFinish: () => setBusy(false),
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
            </p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0 || busy}
            className="btn-secondary h-10 px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mark all read
          </button>
        </motion.div>

        {notifications?.data?.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {notifications.data.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read_at && markRead(n.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-4
                  ${n.read_at
                    ? 'bg-neutral-50/50 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/[0.04] cursor-default'
                    : 'bg-white dark:bg-white/[0.04] border-primary-500/25 hover:border-primary-500/50 hover:bg-primary-500/[0.03] dark:hover:bg-primary-500/[0.06]'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${toneFor(n.type)}`}>
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconFor(n.type)} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${n.read_at
                      ? 'font-medium text-neutral-600 dark:text-dark-text-secondary'
                      : 'font-semibold text-neutral-900 dark:text-white'}`}>
                      {n.subject || 'Notification'}
                    </p>
                    {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
                  </div>
                  {n.body && (
                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-1">{n.body}</p>
                  )}
                  <p className="text-[11px] text-neutral-400/70 dark:text-dark-text-secondary/70 mt-1.5">
                    {fmtDate(n.created_at)}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No notifications</h3>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">
              Notifications appear here as your team works through events and registrations.
            </p>
          </div>
        )}

        {notifications?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={appUrl(`/notifications?page=${page}`)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === notifications.current_page
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
