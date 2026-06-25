import { Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';

const eventTypes = [
  { value: 'live', label: 'Live', icon: '📍' },
  { value: 'virtual', label: 'Virtual', icon: '💻' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
];

export default function EventForm({ form, event, isEdit }) {
  const { data, setData, errors, processing } = form;

  const handleBanner = (e) => { const file = e.target.files[0]; if (!file) return; setData('banner_image', file); };

  const bannerPreview = data.banner_image
    ? (typeof data.banner_image === 'string' ? `/storage/${data.banner_image}` : URL.createObjectURL(data.banner_image))
    : null;

  const sectionClass = "glass-card-premium p-6 space-y-6";
  const fieldClass = "w-full input-field";
  const errorClass = "border-red-500/50 bg-red-500/5";
  const labelClass = "block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Basic Information</h2>
            <div>
              <label className={labelClass}>Event Title</label>
              <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                className={`${fieldClass} ${errors.title ? errorClass : ''}`} placeholder="Enter event title" />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4}
                className={`${fieldClass} resize-none ${errors.description ? errorClass : ''}`} placeholder="Describe your event..." />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
            </div>
            <div>
              <label className={labelClass}>Event Type</label>
              <div className="grid grid-cols-3 gap-3">
                {eventTypes.map((type) => (
                  <button key={type.value} type="button" onClick={() => setData('event_type', type.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                      data.event_type === type.value
                        ? 'border-primary-500/50 bg-primary-500/10 text-primary-400 shadow-sm shadow-primary-500/10'
                        : 'border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/[0.05]'
                    }`}>
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date & Time</label>
                <input type="datetime-local" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}
                  className={`${fieldClass} ${errors.start_date ? errorClass : ''}`} />
                {errors.start_date && <p className="mt-1 text-xs text-red-400">{errors.start_date}</p>}
              </div>
              <div>
                <label className={labelClass}>End Date & Time</label>
                <input type="datetime-local" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}
                  className={`${fieldClass} ${errors.end_date ? errorClass : ''}`} />
                {errors.end_date && <p className="mt-1 text-xs text-red-400">{errors.end_date}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Registration Deadline</label>
              <input type="datetime-local" value={data.registration_deadline} onChange={(e) => setData('registration_deadline', e.target.value)}
                className={`${fieldClass} ${errors.registration_deadline ? errorClass : ''}`} />
              {errors.registration_deadline && <p className="mt-1 text-xs text-red-400">{errors.registration_deadline}</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Venue Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Venue Name</label>
                <input type="text" value={data.venue_name || ''} onChange={(e) => setData('venue_name', e.target.value)} className={fieldClass} placeholder="Venue name" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Venue Address</label>
                <input type="text" value={data.venue_address || ''} onChange={(e) => setData('venue_address', e.target.value)} className={fieldClass} placeholder="Full address" />
              </div>
              <div>
                <label className={labelClass}>Latitude</label>
                <input type="number" step="any" value={data.venue_lat || ''} onChange={(e) => setData('venue_lat', e.target.value)} className={fieldClass} placeholder="40.7128" />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input type="number" step="any" value={data.venue_lng || ''} onChange={(e) => setData('venue_lng', e.target.value)} className={fieldClass} placeholder="-74.0060" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Capacity & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max Capacity</label>
                <input type="number" value={data.max_capacity || ''} onChange={(e) => setData('max_capacity', e.target.value)}
                  className={`${fieldClass} ${errors.max_capacity ? errorClass : ''}`} placeholder="Leave empty for unlimited" min="1" />
                {errors.max_capacity && <p className="mt-1 text-xs text-red-400">{errors.max_capacity}</p>}
              </div>
              <div>
                <label className={labelClass}>Ticket Price ($)</label>
                <input type="number" step="0.01" value={data.ticket_price || ''} onChange={(e) => setData('ticket_price', e.target.value)}
                  className={`${fieldClass} ${errors.ticket_price ? errorClass : ''}`} placeholder="0.00 for free" min="0" />
                {errors.ticket_price && <p className="mt-1 text-xs text-red-400">{errors.ticket_price}</p>}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Status</h2>
            <div className="space-y-3">
              {[
                { value: 'draft', label: 'Draft', desc: 'Not visible to attendees' },
                { value: 'published', label: 'Published', desc: 'Visible and bookable' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] cursor-pointer hover:border-neutral-300 dark:hover:border-white/20 transition-all">
                  <input type="radio" checked={data.status === opt.value} onChange={() => setData('status', opt.value)}
                    className="w-4 h-4 text-primary-500 bg-transparent border-neutral-300 dark:border-white/20 focus:ring-primary-500/40" />
                  <div>
                    <span className="block text-sm font-medium text-neutral-700 dark:text-dark-text">{opt.label}</span>
                    <span className="text-xs text-neutral-500">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={sectionClass}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Banner Image</h2>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] cursor-pointer hover:border-primary-500/40 hover:bg-primary-500/5 transition-all overflow-hidden">
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-neutral-500">Click to upload</span>
                  <span className="text-[10px] text-neutral-400">Max 2MB</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleBanner} className="hidden" />
            </label>
            {errors.banner_image && <p className="text-xs text-red-400">{errors.banner_image}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={sectionClass}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={data.requires_verification ?? true}
                onChange={(e) => setData('requires_verification', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 dark:border-white/20 bg-transparent text-primary-500 focus:ring-primary-500/40" />
              <div>
                <span className="block text-sm font-medium text-neutral-700 dark:text-dark-text group-hover:text-primary-500 transition-colors">Require Identity Verification</span>
                <span className="text-xs text-neutral-500">Attendees must verify before purchasing</span>
              </div>
            </label>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="flex items-center justify-end gap-4 pb-8">
        <Link href={event ? `/events/${event.uuid}` : '/events'} className="btn-secondary h-10 px-6 text-sm">Cancel</Link>
        <button type="submit" disabled={processing} className="btn-primary h-10 px-6 text-sm">
          {processing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : isEdit ? 'Update Event' : 'Create Event'}
        </button>
      </motion.div>
    </div>
  );
}
