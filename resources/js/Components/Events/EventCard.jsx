import { motion } from 'framer-motion';

const statusConfig = {
  published: { label: 'Published', classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  draft: { label: 'Draft', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const typeConfig = {
  live: { label: 'Live', icon: '📍' },
  virtual: { label: 'Virtual', icon: '💻' },
  hybrid: { label: 'Hybrid', icon: '🔄' },
};

function formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function formatTime(dateStr) { return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }

export default function EventCard({ event }) {
  const status = statusConfig[event.status] || statusConfig.draft;
  const type = typeConfig[event.event_type] || { label: 'Live', icon: '📍' };
  const fillPercent = event.max_capacity ? Math.round(((event.confirmed_count || 0) / event.max_capacity) * 100) : 0;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden card-premium-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{type.icon}</span>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{type.label}</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${status.classes}`}>{status.label}</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{event.title}</h3>
        {event.description && <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-4 line-clamp-2">{event.description}</p>}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-dark-text-secondary">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.start_date)}</span>
            <span className="text-neutral-400">·</span>
            <span>{formatTime(event.start_date)}</span>
          </div>
          {event.venue_name && (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-dark-text-secondary">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.venue_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-dark-text-secondary">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={fillPercent >= 80 ? 'text-red-400 font-medium' : ''}>{event.confirmed_count || 0} / {event.max_capacity ?? '∞'} confirmed</span>
          </div>
        </div>
        {event.max_capacity && (
          <div className="relative h-1.5 rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(fillPercent, 100)}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className={`absolute inset-y-0 left-0 rounded-full ${fillPercent >= 80 ? 'bg-red-500' : fillPercent >= 50 ? 'bg-amber-500' : 'bg-green-500'}`} />
          </div>
        )}
      </div>
      <a href={`/events/${event.uuid}`} className="absolute inset-0 z-20" aria-label={`View ${event.title}`} />
    </motion.div>
  );
}
