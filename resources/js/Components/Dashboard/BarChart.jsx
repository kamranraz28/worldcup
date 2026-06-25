import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BarChart({ data, xKey = 'day', valueKey = 'checkins', height = 160, color = '#E30613' }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { setAnimated(true); }, []);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <p className="text-xs text-neutral-400">No data</p>
            </div>
        );
    }

    const maxVal = Math.max(...data.map((d) => d[valueKey]), 1);
    const padding = 16;
    const chartWidth = 320;
    const chartHeight = height;
    const plotHeight = chartHeight - padding * 2;
    const barWidth = (chartWidth - padding * 2) / data.length * 0.6;
    const gap = (chartWidth - padding * 2) / data.length;

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
            {data.map((d, i) => {
                const barH = (d[valueKey] / maxVal) * plotHeight;
                const x = padding + i * gap + (gap - barWidth) / 2;
                const y = chartHeight - padding - barH;

                return (
                    <g key={i}>
                        <motion.rect
                            x={x}
                            y={chartHeight - padding}
                            width={barWidth}
                            height={0}
                            animate={animated ? { y, height: barH } : {}}
                            transition={{ delay: i * 0.04, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                            rx={barWidth / 2}
                            ry={barWidth / 2}
                            fill={color}
                            fillOpacity={0.8}
                            className="hover:fill-opacity-100 transition-all cursor-pointer"
                        />
                        {/* Glow */}
                        <motion.rect
                            x={x}
                            y={y - 4}
                            width={barWidth}
                            height={4}
                            rx={2}
                            fill={color}
                            fillOpacity={0.15}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: animated ? 1 : 0 }}
                            transition={{ delay: 0.3 + i * 0.04 }}
                            className="blur-sm"
                        />
                        <text x={x + barWidth / 2} y={chartHeight - 4} textAnchor="middle"
                            className="text-[8px] fill-neutral-400 dark:fill-dark-text-secondary/50">
                            {d[xKey]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
