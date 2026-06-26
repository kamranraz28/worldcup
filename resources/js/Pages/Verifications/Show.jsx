import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/UI/StatusBadge';
import DocumentViewer from '@/Components/Verifications/DocumentViewer';
import VerificationReviewForm from '@/Components/Verifications/VerificationReviewForm';
import Timeline from '@/Components/UI/Timeline';

export default function Show({ verification }) {
  const { customer } = verification;

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-sm text-neutral-400 mb-4">
            <Link href="/verifications" className="hover:text-neutral-300 dark:hover:text-dark-text transition-colors">Verifications</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-neutral-500 dark:text-dark-text-secondary capitalize">{verification.verification_type} Verification</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                verification.status === 'verified' ? 'bg-green-500/10 text-green-400' :
                verification.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                verification.status === 'flagged' ? 'bg-purple-500/10 text-purple-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {verification.verification_type?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white capitalize">{verification.verification_type} Verification</h1>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={verification.status} size="md" />
                  {customer && (
                    <Link href={`/customers/${customer.uuid}`} className="text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors">
                      {customer.first_name} {customer.last_name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <Link href={`/customers/${customer?.uuid}`} className="btn-secondary h-10 px-5 text-sm">View Customer</Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {verification.ocr_data && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">OCR Data</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(verification.ocr_data).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04]">
                      <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-neutral-700 dark:text-dark-text mt-0.5">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DocumentViewer label="Document Front" imagePath={verification.document_front} />
                <DocumentViewer label="Document Back" imagePath={verification.document_back} />
                <DocumentViewer label="Selfie" imagePath={verification.selfie_image} />
              </div>
            </motion.div>

            {verification.logs?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Activity</h2>
                <Timeline items={verification.logs} />
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-4">Details</h2>
              <div className="space-y-3">
                <div><p className="text-xs text-neutral-500">Type</p><p className="text-sm text-neutral-700 dark:text-dark-text capitalize">{verification.verification_type}</p></div>
                <div><p className="text-xs text-neutral-500">Status</p><StatusBadge status={verification.status} /></div>
                {verification.confidence_score && (
                  <div><p className="text-xs text-neutral-500">Confidence Score</p><p className="text-sm text-neutral-700 dark:text-dark-text">{(verification.confidence_score * 100).toFixed(0)}%</p></div>
                )}
                <div><p className="text-xs text-neutral-500">Submitted</p><p className="text-sm text-neutral-700 dark:text-dark-text">{new Date(verification.created_at).toLocaleString()}</p></div>
                {verification.reviewed_at && <div><p className="text-xs text-neutral-500">Reviewed</p><p className="text-sm text-neutral-700 dark:text-dark-text">{new Date(verification.reviewed_at).toLocaleString()}</p></div>}
                {verification.rejection_reason && <div><p className="text-xs text-neutral-500">Reason</p><p className="text-sm text-red-400">{verification.rejection_reason}</p></div>}
                {verification.expires_at && <div><p className="text-xs text-neutral-500">Expires</p><p className="text-sm text-neutral-700 dark:text-dark-text">{new Date(verification.expires_at).toLocaleDateString()}</p></div>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <VerificationReviewForm verification={verification} />
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
