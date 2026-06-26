import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/Components/UI/StatusBadge';

export default function ScanResult({ result, onClose, onRetry }) {
  const isSuccess = result?.code === 'CHECKED_IN';
  const isDuplicate = result?.code === 'DUPLICATE_SCAN';
  const isOffline = result?.code === 'OFFLINE_QUEUED';
  const isSessionExpired = result?.code === 'SESSION_EXPIRED';

  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl border overflow-hidden backdrop-blur-2xl shadow-2xl ${
            isSuccess ? 'border-green-500/30 bg-dark-surface/90' :
            isDuplicate ? 'border-amber-500/30 bg-dark-surface/90' :
            'border-red-500/30 bg-dark-surface/90'
          }`}>
          <div className={`p-6 text-center ${
            isSuccess ? 'bg-green-500/5' :
            isDuplicate ? 'bg-amber-500/5' : 'bg-red-500/5'
          }`}>
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              isSuccess ? 'bg-green-500/20 text-green-400' :
              isDuplicate ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isSuccess ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isDuplicate ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className={`text-lg font-bold ${
              isSuccess ? 'text-green-400' : isDuplicate ? 'text-amber-400' : 'text-red-400'
            }`}>
              {isSuccess ? 'Check-In Successful!' : isDuplicate ? 'Duplicate Scan' : 'Check-In Failed'}
            </h3>
            <p className="text-sm text-dark-text-secondary mt-1">{result.message}</p>
          </div>

          {result.data?.ticket && (
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-sm font-bold text-primary-400">
                  {result.data.ticket.customer?.initials || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-text">{result.data.ticket.customer?.first_name} {result.data.ticket.customer?.last_name}</p>
                  <p className="text-xs text-dark-text-secondary">{result.data.ticket.customer?.email}</p>
                  {result.data.ticket.customer?.phone && <p className="text-xs text-dark-text-secondary">{result.data.ticket.customer.phone}</p>}
                </div>
                <StatusBadge status={result.data.ticket.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-dark-text-secondary">Ticket</span>
                  <p className="text-dark-text font-medium capitalize mt-0.5">{result.data.ticket.ticket_type}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-dark-text-secondary">QR Code</span>
                  <p className="text-dark-text font-mono mt-0.5 truncate">{result.data.ticket.qr_code}</p>
                </div>
              </div>

              {result.data.previous_checkin && (
                <div className="p-3 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                  <p className="text-xs text-amber-400 font-medium mb-1">Previous Check-In</p>
                  <p className="text-xs text-dark-text-secondary">{new Date(result.data.previous_checkin.scanned_at).toLocaleString()} — by {result.data.previous_checkin.scanned_by || 'staff'}</p>
                </div>
              )}
            </div>
          )}

          {result.data?.ticket?.customer?.nationality && (
            <div className="px-6 pb-2">
              <div className="flex items-center gap-2 text-xs text-dark-text-secondary">
                <span>Nationality: {result.data.ticket.customer.nationality}</span>
              </div>
            </div>
          )}

          <div className="p-4 flex gap-2">
            {!isSuccess && (
              <button onClick={onRetry}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm font-medium text-dark-text hover:bg-white/[0.1] transition-all active:scale-[0.98]">
                Scan Again
              </button>
            )}
            <button onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
                isSuccess ? 'btn-primary' : 'btn-danger'
              }`}>
              {isSuccess ? 'Continue Scanning' : 'Dismiss'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
