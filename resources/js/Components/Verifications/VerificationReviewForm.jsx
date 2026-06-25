import { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerificationReviewForm({ verification }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('approve');

  const form = useForm({
    action: 'approve',
    rejection_reason: '',
    notes: '',
    confidence_score: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post(`/verifications/${verification.uuid}/review`);
  };

  const actionConfig = {
    approve: { label: 'Approve', color: 'from-green-600 to-green-500 shadow-green-500/25' },
    reject: { label: 'Reject', color: 'from-red-600 to-red-500 shadow-red-500/25' },
    flag: { label: 'Flag for Review', color: 'from-purple-600 to-purple-500 shadow-purple-500/25' },
  };

  const config = actionConfig[action] || actionConfig.approve;

  if (verification.status !== 'pending' && verification.status !== 'in_review') {
    const statusLabels = { verified: 'Approved ✓', rejected: 'Rejected ✗', flagged: 'Flagged 🚩' };
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">
        <p className="text-sm text-gray-400">Verification already {statusLabels[verification.status] || verification.status}.</p>
        {verification.reviewer && (
          <p className="text-xs text-gray-500 mt-1">Reviewed by {verification.reviewer.name}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Verification</h3>

      <div className="flex gap-2 mb-4">
        {Object.entries(actionConfig).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            onClick={() => { setAction(key); form.setData('action', key); }}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              action === key
                ? key === 'approve' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : key === 'reject' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/[0.02] text-gray-500 border border-white/10 hover:text-gray-300'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(action === 'reject' || action === 'flag') && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Reason</label>
            <textarea
              value={form.data.rejection_reason}
              onChange={(e) => form.setData('rejection_reason', e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none"
              placeholder="Explain why this verification is being rejected..."
              required
            />
            {form.errors.rejection_reason && <p className="mt-1 text-xs text-red-400">{form.errors.rejection_reason}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Internal Notes (optional)</label>
          <textarea
            value={form.data.notes}
            onChange={(e) => form.setData('notes', e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none"
            placeholder="Add internal notes..."
          />
        </div>

        {action === 'approve' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confidence Score (0-1)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.data.confidence_score}
              onChange={(e) => form.setData('confidence_score', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              placeholder="0.95"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={form.processing}
          className={`w-full px-6 py-2.5 rounded-xl bg-gradient-to-r text-sm font-semibold text-white shadow-lg disabled:opacity-50 transition-all ${config.color}`}
        >
          {form.processing ? 'Processing...' : config.label}
        </button>
      </form>
    </div>
  );
}
