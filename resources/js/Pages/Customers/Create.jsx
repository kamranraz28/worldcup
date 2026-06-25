import { useForm, Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import CustomerForm from '@/Components/Customers/CustomerForm';

export default function Create() {
  const form = useForm({
    first_name: '', last_name: '', email: '', phone: '',
    date_of_birth: '', nationality: '', document_type: '', document_number: '',
  });
  const handleSubmit = (e) => { e.preventDefault(); form.post('/customers'); };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/customers" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Customers</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Create</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Add Customer</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Register a new customer profile</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <CustomerForm form={form} />
        </form>
      </div>
    </AppLayout>
  );
}
