import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import GalleryUploader from '@/Components/Events/GalleryUploader';

const statusConfig = {
  published: { label: 'Published', classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  draft: { label: 'Draft', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const typeIcons = { live: '\uD83D\uDCCD', virtual: '\uD83D\uDCBB', hybrid: '\uD83D\uDD04' };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function DetailRow({ icon, label, value, highlight }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 dark:border-white/[0.04] last:border-0">
      <span className="text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{label}</p>
        <p className={`text-sm mt-0.5 ${highlight ? 'text-primary-400 font-medium' : 'text-neutral-700 dark:text-dark-text'}`}>{value || '\u2014'}</p>
      </div>
    </div>
  );
}

export default function Show({ event }) {
  const { flash } = usePage().props;
  const status = statusConfig[event.status] || statusConfig.draft;
  const fillPercent = event.max_capacity
    ? Math.round(((event.confirmed_tickets || 0) / event.max_capacity) * 100)
    : 0;

  const canPublish = event.status === 'draft' && new Date(event.start_date) > new Date();
  const canCancel = ['draft', 'published'].includes(event.status) && new Date(event.start_date) > new Date();

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/events" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Events</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">{event.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-2xl">
                {typeIcons[event.event_type] || '\uD83D\uDCCD'}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{event.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.classes}`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-dark-text-secondary">
                    by {event.creator?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canPublish && (
                <form method="POST" action={`/events/${event.uuid}/publish`} className="inline">
                  <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                  <button type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-sm font-semibold text-white shadow-lg shadow-green-500/25 hover:from-green-500 hover:to-green-400 transition-all">
                    Publish
                  </button>
                </form>
              )}
              {canCancel && (
                <form method="POST" action={`/events/${event.uuid}/cancel`} className="inline">
                  <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                  <button type="submit" onClick={(e) => { if (!confirm('Cancel this event?')) e.preventDefault(); }}
                    className="px-4 py-2 rounded-xl border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                    Cancel Event
                  </button>
                </form>
              )}
              <form method="POST" action={`/events/${event.uuid}/duplicate`} className="inline">
                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                <button type="submit"
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/[0.06] text-sm font-medium text-neutral-500 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-all">
                  Duplicate
                </button>
              </form>
              <Link
                href={`/events/${event.uuid}/edit`}
                className="px-4 py-2 rounded-xl btn-primary text-sm"
              >
                Edit Event
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Description</h2>
              <p className="text-sm text-neutral-500 dark:text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                {event.description || 'No description provided.'}
              </p>
            </motion.div>

            {event.banner_image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/[0.06]"
              >
                <img src={`/storage/${event.banner_image}`} alt={event.title} className="w-full h-64 object-cover" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sessions</h2>
              {event.sessions?.length > 0 ? (
                <div className="space-y-3">
                  {event.sessions.map((session, i) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.04]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{session.title}</p>
                        <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">
                          {formatDate(session.start_time)} &middot; {formatTime(session.start_time)} - {formatTime(session.end_time)}
                        </p>
                        {session.location && <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">{session.location}</p>}
                      </div>
                      {session.capacity && (
                        <span className="text-xs text-neutral-500 dark:text-dark-text-secondary">Cap: {session.capacity}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">No sessions scheduled.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <GalleryUploader
                eventId={event.uuid}
                gallery={event.gallery || []}
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-1">Capacity</h2>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">{event.confirmed_tickets || 0}</span>
                <span className="text-sm text-neutral-500 dark:text-dark-text-secondary">/ {event.max_capacity ?? '\u221E'}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mb-3">
                {event.checked_in_count || 0} checked in
              </p>
              {event.max_capacity && (
                <div className="relative h-2 rounded-full bg-neutral-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(fillPercent, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      fillPercent >= 80 ? 'bg-primary-500' : fillPercent >= 50 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Details</h2>
              <div className="space-y-1">
                <DetailRow icon="📅" label="Start Date" value={`${formatDate(event.start_date)} at ${formatTime(event.start_date)}`} />
                <DetailRow icon="⏰" label="End Date" value={`${formatDate(event.end_date)} at ${formatTime(event.end_date)}`} />
                <DetailRow icon="🔔" label="Registration Deadline" value={event.registration_deadline ? formatDate(event.registration_deadline) : 'None'} />
                <DetailRow icon="🎫" label="Ticket Price" value={event.ticket_price > 0 ? `$${Number(event.ticket_price).toFixed(2)}` : 'Free'} highlight={event.ticket_price > 0} />
                <DetailRow icon="📍" label="Event Type" value={event.event_type?.charAt(0).toUpperCase() + event.event_type?.slice(1)} />
                <DetailRow icon="🏛️" label="Venue" value={event.venue_name} />
                <DetailRow icon="📮" label="Address" value={event.venue_address} />
                <DetailRow icon="🆔" label="Requires Verification" value={event.requires_verification ? 'Yes' : 'No'} />
              </div>
            </motion.div>

            {event.creator && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Created By</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-400">
                    {event.creator.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{event.creator.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-dark-text-secondary">{event.creator.email}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href={`/events/${event.uuid}/edit`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] hover:bg-neutral-100 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] transition-all">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-sm text-neutral-700 dark:text-dark-text">Edit Event</span>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] hover:bg-neutral-100 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm text-neutral-700 dark:text-dark-text">View Public Page</span>
                </div>
                <Link href="/events"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] hover:bg-neutral-100 dark:hover:bg-white/[0.04] border border-neutral-100 dark:border-white/[0.04] transition-all">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm text-neutral-700 dark:text-dark-text">Back to Events</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
