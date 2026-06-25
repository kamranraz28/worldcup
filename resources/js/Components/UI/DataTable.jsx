import { useState } from 'react';
import { motion } from 'framer-motion';
import { TableSkeleton } from '@/Components/Dashboard/Skeleton';

export default function DataTable({
    columns,
    rows,
    loading = false,
    emptyMessage = 'No data found',
    emptyDescription = '',
    onRowClick,
    actions,
    sortable = true,
}) {
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (field) => {
        if (!sortable) return;
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sortedRows = [...(rows || [])].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="card-premium overflow-hidden">
                <TableSkeleton rows={5} cols={columns.length} />
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <div className="card-premium flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-dark-muted border border-neutral-200 dark:border-dark-border
                    flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">{emptyMessage}</h3>
                {emptyDescription && (
                    <p className="text-sm text-neutral-500 dark:text-dark-text-secondary max-w-xs">{emptyDescription}</p>
                )}
            </div>
        );
    }

    return (
        <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-neutral-50/50 dark:bg-white/[0.015]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    className={`table-header-cell ${col.sortable !== false && sortable ? 'cursor-pointer hover:text-neutral-700 dark:hover:text-dark-text transition-colors select-none' : ''}`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {sortField === col.key && sortable && (
                                            <svg className={`w-3 h-3 transition-transform duration-200 ${sortDir === 'desc' ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="table-header-cell text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows.map((row, i) => (
                            <motion.tr
                                key={row.id || i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.025 }}
                                onClick={() => onRowClick?.(row)}
                                className={`table-row table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="table-body-cell">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
