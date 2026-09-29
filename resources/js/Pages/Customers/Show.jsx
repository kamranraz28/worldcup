import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-neutral-100 dark:border-white/[0.04] last:border-0">
      <span className="flex items-center gap-2 text-sm text-neutral-500 dark:text-dark-text-secondary">
        <span>{icon}</span> {label}
      </span>
      <span className="text-sm text-neutral-700 dark:text-dark-text font-medium">{value || '—'}</span>
    </div>
  );
}

export default function Show({ customer, duplicates }) {
  const initials = (customer.first_name?.charAt(0) || '') + (customer.last_name?.charAt(0) || '');

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href={appUrl("/customers")} className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Customers</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">{customer.first_name} {customer.last_name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center text-xl font-bold text-primary-400">
                {initials.toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{customer.first_name} {customer.last_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-500 dark:text-dark-text-secondary">{customer.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={appUrl(`/customers/${customer.uuid}/edit`)} className="btn-primary h-10 px-5 text-sm">Edit</Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {duplicates?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.02] to-transparent"
              >
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-amber-400">Potential Duplicates</h2>
                </div>
                <div className="space-y-2">
                  {duplicates.map((dup) => (
                    <Link key={dup.uuid} href={appUrl(`/customers/${dup.uuid}`)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-amber-500/10 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-all"
                    >
                      <span className="text-sm text-neutral-700 dark:text-dark-text">{dup.first_name} {dup.last_name}</span>
                      <span className="text-xs text-neutral-500">{dup.email}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Details</h2>
              <DetailRow icon="📧" label="Email" value={customer.email} />
              <DetailRow icon="📞" label="Phone" value={customer.phone} />
              <DetailRow icon="🎂" label="Date of Birth" value={customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : null} />
              <DetailRow icon="🌍" label="Nationality" value={customer.nationality} />
              <DetailRow icon="🪪" label="Document Type" value={customer.document_type} />
              <DetailRow icon="🔢" label="Document Number" value={customer.document_number} />
              <DetailRow icon="🎟️" label="Tickets" value={customer.tickets?.length || 0} />
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}