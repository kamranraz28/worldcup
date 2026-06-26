import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function CustomerForm({ form, customer }) {
  const { data, setData, errors, processing } = form;

  const sectionClass = "glass-card-premium p-6 space-y-6";
  const fieldClass = "w-full input-field";
  const errorClass = "border-red-500/50 bg-red-500/5";
  const labelClass = "block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={sectionClass}>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)}
              className={`${fieldClass} ${errors.first_name ? errorClass : ''}`} placeholder="John" />
            {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>}
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)}
              className={`${fieldClass} ${errors.last_name ? errorClass : ''}`} placeholder="Doe" />
            {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
              className={`${fieldClass} ${errors.email ? errorClass : ''}`} placeholder="john@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)}
              className={`${fieldClass} ${errors.phone ? errorClass : ''}`} placeholder="+1234567890" />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input type="date" value={data.date_of_birth || ''} onChange={(e) => setData('date_of_birth', e.target.value)}
              className={`${fieldClass} ${errors.date_of_birth ? errorClass : ''}`} />
            {errors.date_of_birth && <p className="mt-1 text-xs text-red-400">{errors.date_of_birth}</p>}
          </div>
          <div>
            <label className={labelClass}>Nationality (ISO 3-letter code)</label>
            <input type="text" value={data.nationality || ''} onChange={(e) => setData('nationality', e.target.value.toUpperCase())}
              className={`${fieldClass} ${errors.nationality ? errorClass : ''}`} placeholder="USA" maxLength={3} />
            {errors.nationality && <p className="mt-1 text-xs text-red-400">{errors.nationality}</p>}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Identity Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Document Type</label>
            <select value={data.document_type || ''} onChange={(e) => setData('document_type', e.target.value)}
              className={`${fieldClass} ${errors.document_type ? errorClass : ''}`}>
              <option value="">Select type...</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="drivers_license">Driver License</option>
            </select>
            {errors.document_type && <p className="mt-1 text-xs text-red-400">{errors.document_type}</p>}
          </div>
          <div>
            <label className={labelClass}>Document Number</label>
            <input type="text" value={data.document_number || ''} onChange={(e) => setData('document_number', e.target.value)}
              className={`${fieldClass} ${errors.document_number ? errorClass : ''}`} placeholder="AB1234567" />
            {errors.document_number && <p className="mt-1 text-xs text-red-400">{errors.document_number}</p>}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex items-center justify-end gap-4 pb-8">
        <Link href={customer ? `/customers/${customer.uuid}` : '/customers'} className="btn-secondary h-10 px-6 text-sm">Cancel</Link>
        <button type="submit" disabled={processing} className="btn-primary h-10 px-6 text-sm">
          {processing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : customer ? 'Update Customer' : 'Create Customer'}
        </button>
      </motion.div>
    </div>
  );
}
