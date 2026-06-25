import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AreaChart({ data, xKey = 'date', series, height = 220, className = '' }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { setAnimated(true); }, []);

    if (!data || data.length === 0) {
        return <EmptyChart height={height} />;
    }

    const padding = { top: 20, right: 16, bottom: 28, left: 8 };
    const chartWidth = 600;
    const chartHeight = height;
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const allValues = data.flatMap((d) => series.map((s) => d[s.key]));
    const maxVal = Math.max(...allValues, 1);
    const minVal = Math.min(...allValues, 0);
    const range = maxVal - minVal || 1;

    const xScale = (i) => padding.left + (i / Math.max(data.length - 1, 1)) * plotWidth;
    const yScale = (v) => padding.top + plotHeight - ((v - minVal) / range) * plotHeight;

    const colors = ['#E30613', '#FFD54F', '#16A34A', '#3B82F6'];
    const gradients = [
        { id: 'grad-red', from: '#E30613', to: 'rgba(227,6,19,0)' },
        { id: 'grad-gold', from: '#FFD54F', to: 'rgba(255,213,79,0)' },
        { id: 'grad-green', from: '#16A34A', to: 'rgba(22,163,74,0)' },
        { id: 'grad-blue', from: '#3B82F6', to: 'rgba(59,130,246,0)' },
    ];

    return (
        <div className={`relative ${className}`}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <defs>
                    {gradients.map((g) => (
                        <linearGradient key={g.id} id={g.id} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={g.from} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={g.to} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padding.top + plotHeight * (1 - ratio);
                    return (
                        <g key={ratio}>
                            <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y}
                                stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
                            <text x={padding.left - 6} y={y + 3} textAnchor="end"
                                className="text-[9px] fill-neutral-400 dark:fill-dark-text-secondary/50"
                                opacity={0.7}>
                                {Math.round(minVal + range * ratio)}
                            </text>
                        </g>
                    );
                })}

                {/* Series */}
                {series.map((s, si) => {
                    const points = data.map((d, i) => `${xScale(i)},${yScale(d[s.key])}`).join(' ');

                    return (
                        <g key={s.key}>
                            {/* Area */}
                            <motion.path
                                d={`M${padding.left},${padding.top + plotHeight} ${points} ${xScale(data.length - 1)},${padding.top + plotHeight}`}
                                fill={`url(#${gradients[si].id})`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: animated ? 1 : 0 }}
                                transition={{ duration: 0.6, delay: si * 0.1 }}
                            />
                            {/* Line */}
                            <motion.path
                                d={`M${points}`}
                                fill="none"
                                stroke={colors[si]}
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: animated ? 1 : 0 }}
                                transition={{ duration: 0.8, delay: si * 0.15, ease: [0.25, 1, 0.5, 1] }}
                            />
                            {/* Dots */}
                            {animated && data.map((d, i) => (
                                <motion.circle
                                    key={i}
                                    cx={xScale(i)}
                                    cy={yScale(d[s.key])}
                                    r={3}
                                    fill={colors[si]}
                                    stroke="white"
                                    strokeWidth={2}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + i * 0.03, type: 'spring', stiffness: 200 }}
                                    className="cursor-pointer hover:r-4 transition-all"
                                />
                            ))}
                        </g>
                    );
                })}

                {/* X-axis labels */}
                {data.map((d, i) => {
                    const skip = data.length > 10 ? Math.ceil(data.length / 7) : 1;
                    if (i % skip !== 0 && i !== data.length - 1) return null;
                    return (
                        <text key={i} x={xScale(i)} y={chartHeight - 4} textAnchor="middle"
                            className="text-[9px] fill-neutral-400 dark:fill-dark-text-secondary/50">
                            {d[xKey]}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}

function EmptyChart({ height }) {
    return (
        <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-xs text-neutral-400">No data available</p>
        </div>
    );
}
