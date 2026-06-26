import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function CustomerCard({ customer }) {
  const initials = (customer.first_name?.charAt(0) || '') + (customer.last_name?.charAt(0) || '');

  return (
    <div className="group relative card-premium-hover p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center text-lg font-bold text-primary-400">
          {initials.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{customer.first_name} {customer.last_name}</h3>
          <p className="text-xs text-neutral-500 truncate">{customer.email}</p>
        </div>
        <StatusBadge status={customer.is_verified ? 'verified' : 'pending'} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-neutral-500">Phone</span><p className="text-neutral-700 dark:text-dark-text mt-0.5 truncate">{customer.phone || '—'}</p></div>
        <div><span className="text-neutral-500">Nationality</span><p className="text-neutral-700 dark:text-dark-text mt-0.5">{customer.nationality || '—'}</p></div>
        <div><span className="text-neutral-500">Document</span><p className="text-neutral-700 dark:text-dark-text mt-0.5 truncate">{customer.document_type || '—'}</p></div>
        <div><span className="text-neutral-500">Verifications</span><p className="text-neutral-700 dark:text-dark-text mt-0.5">{customer.verification_count || 0}</p></div>
      </div>

      {customer.date_of_birth && (
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-xs text-neutral-500">
          DOB: {new Date(customer.date_of_birth).toLocaleDateString()}
        </div>
      )}

      <Link href={`/customers/${customer.uuid}`} className="absolute inset-0 z-10" aria-label="View customer" />
    </div>
  );
}
