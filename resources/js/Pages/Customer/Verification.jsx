import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Verification({ status, customer, verification }) {
    const { errors } = usePage().props;
    const [verificationType, setVerificationType] = useState('identity');
    const [documentFront, setDocumentFront] = useState(null);
    const [documentBack, setDocumentBack] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('verification_type', verificationType);
        if (documentFront) formData.append('document_front', documentFront);
        if (documentBack) formData.append('document_back', documentBack);
        if (selfie) formData.append('selfie_image', selfie);
        if (notes) formData.append('notes', notes);

        router.post(route('customer.verification.store'), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => setSubmitting(false),
        });
    };

    const renderFileInput = (label, file, setFile, field) => (
        <div>
            <label className="text-xs font-medium text-neutral-500 dark:text-dark-text-secondary mb-1.5 block">{label}</label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${file ? 'border-primary-500/30 bg-primary-500/5' : 'border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-neutral-50 dark:bg-white/[0.02]'}`}>
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-600 dark:text-dark-text-secondary">{file ? file.name : `Upload ${label}`}</p>
                    <p className="text-xs text-neutral-400 dark:text-dark-text-secondary mt-0.5">JPEG, PNG or WebP • Max 5MB</p>
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="hidden" />
                {file && (
                    <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-xs text-red-500 hover:text-red-400 font-medium">Remove</button>
                )}
            </label>
            {errors?.[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
        </div>
    );

    if (status === 'verified') {
        return (
            <AppLayout>
                <div className="max-w-xl mx-auto text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Identity Verified</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-2">Your identity has been verified. You can register for all events.</p>
                </div>
            </AppLayout>
        );
    }

    if (status === 'pending') {
        return (
            <AppLayout>
                <div className="max-w-xl mx-auto text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Verification Pending</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-2">Your identity verification is being reviewed. We'll notify you once it's complete.</p>
                    {verification?.rejection_reason && (
                        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                            Previously rejected: {verification.rejection_reason}
                        </div>
                    )}
                    <button onClick={() => router.get(route('customer.dashboard'))} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/[0.04] text-sm font-medium text-neutral-700 dark:text-dark-text hover:bg-neutral-200 dark:hover:bg-white/[0.08] transition-all">
                        Back to Dashboard
                    </button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Identity Verification</h1>
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Upload your documents to verify your identity.</p>
                </motion.div>

                {verification?.rejection_reason && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                        Previous verification was rejected: {verification.rejection_reason}. Please submit again with correct documents.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5" encType="multipart/form-data">
                    <div className="glass-card p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Verification Type</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'identity', label: 'Identity' },
                                { value: 'address', label: 'Address' },
                                { value: 'age', label: 'Age' },
                                { value: 'ticket_eligibility', label: 'Ticket Eligibility' },
                            ].map(t => (
                                <button key={t.value} type="button" onClick={() => setVerificationType(t.value)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${verificationType === t.value ? 'bg-primary-500/10 border-primary-500/30 text-primary-500' : 'bg-neutral-50 dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-dark-text-secondary hover:border-neutral-300 dark:hover:border-white/20'}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {errors?.verification_type && <p className="text-xs text-red-500">{errors.verification_type}</p>}
                    </div>

                    <div className="glass-card p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Documents</h2>
                        {renderFileInput('Document Front (Required)', documentFront, setDocumentFront, 'document_front')}
                        {renderFileInput('Document Back', documentBack, setDocumentBack, 'document_back')}
                        {renderFileInput('Selfie Image', selfie, setSelfie, 'selfie_image')}
                    </div>

                    <div className="glass-card p-5">
                        <label className="text-xs font-medium text-neutral-500 dark:text-dark-text-secondary mb-1.5 block">Notes (Optional)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={500}
                            className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none"
                            placeholder="Any additional information..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={submitting || !documentFront}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                        >
                            {submitting ? 'Submitting...' : 'Submit Verification'}
                        </button>
                        <Link href={route('customer.dashboard')} className="text-sm text-neutral-500 dark:text-dark-text-secondary hover:text-neutral-700 dark:hover:text-white transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}


