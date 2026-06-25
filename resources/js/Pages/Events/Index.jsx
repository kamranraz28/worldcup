import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import EventCard from '@/Components/Events/EventCard';
import StatCard from '@/Components/UI/StatCard';

export default function Index({ events, filters, stats }) {
  const { errors } = usePage().props;
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [typeFilter, setTypeFilter] = useState(filters.event_type || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('event_type', typeFilter);
    window.location.href = `/events?${params.toString()}`;
  };

  const totalEvents = stats?.total ?? 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Events</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">
              Manage and monitor all your events
            </p>
          </div>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 btn-primary h-10 px-5 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={totalEvents} variant="primary" />
          <StatCard label="Published" value={stats?.published ?? 0} variant="green" />
          <StatCard label="Drafts" value={stats?.draft ?? 0} variant="amber" />
          <StatCard label="Upcoming" value={stats?.upcoming ?? 0} variant="blue" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 input-field"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 input-field w-full sm:w-40"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 input-field w-full sm:w-40"
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="live">Live</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <button onClick={handleFilter} className="btn-primary px-5 h-10 text-sm whitespace-nowrap">
              Filter
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {events?.data?.length > 0 ? (
            <motion.div
              key="events-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {events.data.map((event, i) => (
                <motion.div
                  key={event.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.06] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No events found</h3>
              <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mb-6">
                {search ? 'Try a different search term' : 'Get started by creating your first event'}
              </p>
              {!search && (
                <Link
                  href="/events/create"
                  className="inline-flex items-center gap-2 btn-primary h-10 px-5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {events?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: events.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/events?page=${page}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all
                  ${page === events.current_page
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 border border-neutral-200 dark:border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
                aria-current={page === events.current_page ? 'page' : undefined}
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
