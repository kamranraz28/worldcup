import { useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import EventForm from '@/Components/Events/EventForm';

export default function Create() {
  const form = useForm({
    title: '',
    description: '',
    event_type: 'live',
    venue_name: '',
    venue_address: '',
    venue_lat: '',
    venue_lng: '',
    max_capacity: '',
    ticket_price: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    banner_image: null,
    requires_verification: true,
    status: 'draft',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/events');
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/events" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Events</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Create</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Create Event</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Set up a new event for your attendees</p>
        </motion.div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <EventForm form={form} />
        </form>
      </div>
    </AppLayout>
  );
}
