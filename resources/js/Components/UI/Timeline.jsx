const actionIcons = {
    created: 'M12 4v16m8-8H4',
    submitted: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    rejected: 'M6 18L18 6M6 6l12 12',
    flagged: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
    updated: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    deleted: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
};

const actionColors = {
    approved: 'border-green-500/20 bg-green-500/10 text-green-400',
    rejected: 'border-red-500/20 bg-red-500/10 text-red-400',
    flagged: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
    submitted: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    created: 'border-primary-500/20 bg-primary-500/10 text-primary-400',
    updated: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    deleted: 'border-red-500/20 bg-red-500/10 text-red-400',
};

export default function Timeline({ items }) {
    if (!items?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-dark-muted border border-neutral-200 dark:border-dark-border flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">No activity recorded</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-neutral-200 via-neutral-200 to-transparent dark:from-white/[0.06] dark:via-white/[0.06] dark:to-transparent" />
            <div className="space-y-4">
                {items.map((log, i) => {
                    const iconPath = actionIcons[log.action] || actionIcons.submitted;
                    const color = actionColors[log.action] || 'border-neutral-200 dark:border-white/[0.06] bg-neutral-100 dark:bg-white/[0.03] text-neutral-400';
                    const date = new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={log.id || i} className="flex gap-4 group">
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl border ${color} flex-shrink-0
                                group-hover:scale-110 transition-transform duration-200`}>
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                                        {log.action.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-neutral-400">{date}</span>
                                </div>
                                {log.notes && <p className="text-xs text-neutral-500 dark:text-dark-text-secondary mt-0.5">{log.notes}</p>}
                                <div className="flex items-center gap-2 mt-1">
                                    {log.actor && (
                                        <span className="text-[10px] text-neutral-400">
                                            by {log.actor.name}
                                        </span>
                                    )}
                                    {log.status_from && log.status_to && (
                                        <span className="text-[10px] text-neutral-400">
                                            {log.status_from} &rarr; {log.status_to}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
