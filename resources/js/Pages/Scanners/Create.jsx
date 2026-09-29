import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import ScannerForm from '@/Components/Scanners/ScannerForm';

export default function Create({ events }) {
  const form = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    is_active: true,
    event_ids: [],
  });

  const submit = (e) => {
    e.preventDefault();
    form.post('/scanners');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/scanners" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Scanners</Link>
            <span>/</span>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Create</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">New Scanner</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Create a scanner account and assign it to one or more events.</p>
        </motion.div>

        <form onSubmit={submit} className="space-y-6">
          <ScannerForm form={form} events={events} />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={form.processing} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {form.processing ? 'Saving...' : 'Create Scanner'}
            </button>
            <Link href="/scanners" className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-white">Cancel</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
