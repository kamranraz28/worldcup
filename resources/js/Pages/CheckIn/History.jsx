import { Link } from '@inertiajs/inertia-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function CheckInHistory({ checkIns, filters, events, stats }) {
  const [search, setSearch] = useState(filters.search || '');
  const [eventFilter, setEventFilter] = useState(filters.event_id || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [validFilter, setValidFilter] = useState(filters.is_valid || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (eventFilter) params.set('event_id', eventFilter);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      if (validFilter) params.set('is_valid', validFilter);
      window.location.href = `/check-in/history?${params.toString()}`;
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, eventFilter, dateFrom, dateTo, validFilter]);

  const fmtDateTime = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Check-In History</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">View all scanned tickets and attendance records</p>
          </div>
          <Link href="/check-in" className="btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Scanner
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Today', value: stats?.today || 0, color: 'text-green-400' },
            { label: 'Yesterday', value: stats?.yesterday || 0, color: 'text-dark-text' },
            { label: 'Valid Today', value: stats?.valid_today || 0, color: 'text-blue-400' },
            { label: 'Change', value: (stats?.change || 0) + '%', color: 'text-amber-400' },
            { label: 'Total', value: checkIns?.total || checkIns?.data?.length || 0, color: 'text-dark-text' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer name, email, QR code..." className="w-full pl-10 pr-4 py-2.5 input-field" />
            </div>
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="input-field px-3 py-2.5 w-full sm:w-44">
              <option value="">All Events</option>
              {events?.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <select value={validFilter} onChange={(e) => setValidFilter(e.target.value)} className="input-field px-3 py-2.5 w-full sm:w-36">
              <option value="">All Results</option>
              <option value="1">Valid</option>
              <option value="0">Invalid</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field px-3 py-2.5 w-full sm:w-40" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field px-3 py-2.5 w-full sm:w-40" />
          </div>
        </motion.div>

        {checkIns?.data?.length > 0 ? (
          <div className="space-y-2">
            {checkIns.data.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
                className="flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/[0.05] transition-all cursor-pointer"
                onClick={() => window.location.href = `/check-in/history/${c.id}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${c.is_valid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.is_valid ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">{c.customer?.first_name} {c.customer?.last_name}</p>
                    <StatusBadge status={c.is_valid ? 'confirmed' : 'rejected'} />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">
                    {c.event?.title} · {c.ticket?.ticket_type} · {fmtDateTime(c.scanned_at)}
                  </p>
                </div>
                <div className="text-right text-xs text-neutral-500">
                  <p>{c.scan_method?.toUpperCase()}</p>
                  <p className="text-neutral-400">{c.scanner}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No check-in records found</h3>
            <Link href="/check-in" className="mt-4 btn-primary h-10 px-5 text-sm inline-flex items-center gap-2">Go to Scanner</Link>
          </div>
        )}

        {checkIns?.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            {Array.from({ length: checkIns.last_page }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`/check-in/history?page=${page}${eventFilter ? '&event_id=' + eventFilter : ''}${search ? '&search=' + search : ''}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${page === checkIns.current_page ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-neutral-400 border border-neutral-200 dark:border-white/10 hover:bg-white/[0.03]'}`}
              >{page}</Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
