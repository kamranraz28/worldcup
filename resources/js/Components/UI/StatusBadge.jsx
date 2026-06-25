const statusColors = {
    verified: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Verified' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Rejected' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', label: 'Pending' },
    in_review: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'In Review' },
    flagged: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-500', label: 'Flagged' },
    active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Active' },
    inactive: { bg: 'bg-neutral-500/10', text: 'text-neutral-400', border: 'border-neutral-500/20', dot: 'bg-neutral-500', label: 'Inactive' },
    draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', label: 'Draft' },
    published: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Published' },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Cancelled' },
    blacklisted: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Blacklisted' },
    confirmed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Confirmed' },
    pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', label: 'Pending' },
    reserved: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'Reserved' },
    redeemed: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', dot: 'bg-indigo-500', label: 'Redeemed' },
    completed: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500', label: 'Completed' },
};

export default function StatusBadge({ status, size = 'sm' }) {
    const config = statusColors[status] || {
        bg: 'bg-neutral-500/10', text: 'text-neutral-400', border: 'border-neutral-500/20', dot: 'bg-neutral-500', label: status
    };
    const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

    return (
        <span className={`inline-flex items-center rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
            {config.label}
        </span>
    );
}
