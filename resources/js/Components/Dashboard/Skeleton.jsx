export function CardSkeleton({ height = 'h-32' }) {
    return (
        <div className={`${height} card-premium p-5`}>
            <div className="space-y-3 animate-pulse">
                <div className="h-3 w-24 skeleton rounded" />
                <div className="h-8 w-20 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
            </div>
        </div>
    );
}

export function ChartSkeleton({ height = 'h-[220px]' }) {
    return (
        <div className={`${height} card-premium p-5`}>
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-36 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
            </div>
            <div className="h-[140px] flex items-end gap-2 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 skeleton rounded-t"
                        style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
            </div>
        </div>
    );
}

export function ListSkeleton({ rows = 4 }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl skeleton" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 skeleton rounded" />
                        <div className="h-2.5 w-1/2 skeleton rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
    return (
        <div className="animate-pulse p-5 space-y-4">
            <div className="flex gap-4 pb-3 border-b border-neutral-100 dark:border-white/[0.04]">
                {Array.from({ length: cols }).map((_, j) => (
                    <div key={j} className="flex-1 h-3 skeleton rounded" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="flex-1 h-3.5 skeleton rounded" />
                    ))}
                </div>
            ))}
        </div>
    );
}
