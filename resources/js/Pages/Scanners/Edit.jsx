import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import ScannerForm from '@/Components/Scanners/ScannerForm';

export default function Edit({ scanner, events }) {
  const form = useForm({
    name: scanner.name,
    email: scanner.email,
    phone: scanner.phone || '',
    password: '',
    password_confirmation: '',
    is_active: scanner.is_active,
    event_ids: scanner.event_ids || [],
  });

  const submit = (e) => {
    e.preventDefault();
    form.post(`/scanners/${scanner.uuid}`, { _method: 'patch' });
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/scanners" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Scanners</Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Edit</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Edit Scanner</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">{scanner.email}</p>
        </motion.div>

        <form onSubmit={submit} className="space-y-6">
          <ScannerForm form={form} events={events} isEdit />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={form.processing} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {form.processing ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/scanners" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-white">Cancel</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
