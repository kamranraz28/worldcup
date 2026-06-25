import { useState } from 'react';

export default function BlacklistForm({ customer, onSubmit }) {
  const [reason, setReason] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reason', reason);
    if (durationDays) formData.append('duration_days', durationDays);
    fetch(`/customers/${customer.uuid}/blacklist`, {
      method: 'POST', body: formData,
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
    }).then(() => { setIsOpen(false); if (onSubmit) onSubmit(); });
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all text-left active:scale-[0.99]">
        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span className="text-sm text-red-400">{customer.is_blacklisted ? 'Update Blacklist' : 'Blacklist Customer'}</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
          <div>
            <label className="block text-xs font-medium text-red-300 mb-1">Reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
              className="w-full input-field text-sm" placeholder="Enter reason for blacklisting..." required />
          </div>
          <div>
            <label className="block text-xs font-medium text-red-300 mb-1">Duration (days, optional)</label>
            <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} min="1"
              className="w-full input-field" placeholder="Leave empty for permanent" />
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all active:scale-[0.98]">Confirm</button>
            <button type="button" onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg bg-white/5 text-neutral-500 text-sm hover:bg-white/10 transition-all">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
