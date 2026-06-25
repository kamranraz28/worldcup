import { useForm, Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import EventForm from '@/Components/Events/EventForm';

export default function Edit({ event }) {
  const form = useForm({
    title: event.title,
    description: event.description || '',
    event_type: event.event_type,
    venue_name: event.venue_name || '',
    venue_address: event.venue_address || '',
    venue_lat: event.venue_lat || '',
    venue_lng: event.venue_lng || '',
    max_capacity: event.max_capacity || '',
    ticket_price: event.ticket_price || '',
    start_date: event.start_date ? event.start_date.slice(0, 16) : '',
    end_date: event.end_date ? event.end_date.slice(0, 16) : '',
    registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : '',
    banner_image: event.banner_image || null,
    requires_verification: event.requires_verification ?? true,
    status: event.status,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post(`/events/${event.uuid}`, { _method: 'patch' });
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
            <Link href={`/events/${event.uuid}`} className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">{event.title}</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary">Edit</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Edit Event</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">{event.title}</p>
        </motion.div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <EventForm form={form} event={event} isEdit />
        </form>
      </div>
    </AppLayout>
  );
}
