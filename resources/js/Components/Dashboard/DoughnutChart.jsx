import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function DoughnutChart({ data, nameKey = 'type', valueKey = 'count', size = 180, innerRadius = 0.6 }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { setAnimated(true); }, []);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                <p className="text-xs text-neutral-400">No data</p>
            </div>
        );
    }

    const total = data.reduce((sum, d) => sum + d[valueKey], 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 8;
    const innerR = outerR * innerRadius;

    const colorPalette = ['#E30613', '#FFD54F', '#16A34A', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'];

    let accumulated = 0;

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((d, i) => {
                    const percent = d[valueKey] / total;
                    const angle = percent * 360;
                    const startAngle = (accumulated / total) * 360 - 90;
                    const endAngle = ((accumulated + d[valueKey]) / total) * 360 - 90;
                    accumulated += d[valueKey];

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = cx + outerR * Math.cos(startRad);
                    const y1 = cy + outerR * Math.sin(startRad);
                    const x2 = cx + outerR * Math.cos(endRad);
                    const y2 = cy + outerR * Math.sin(endRad);

                    const x1i = cx + innerR * Math.cos(endRad);
                    const y1i = cy + innerR * Math.sin(endRad);
                    const x2i = cx + innerR * Math.cos(startRad);
                    const y2i = cy + innerR * Math.sin(startRad);

                    const largeArc = angle > 180 ? 1 : 0;

                    const path = [
                        `M ${x1} ${y1}`,
                        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
                        `L ${x1i} ${y1i}`,
                        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
                        'Z',
                    ].join(' ');

                    return (
                        <motion.path
                            key={i}
                            d={path}
                            fill={colorPalette[i % colorPalette.length]}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: animated ? 1 : 0, opacity: animated ? 1 : 0 }}
                            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                            className="hover:brightness-110 transition-all cursor-pointer"
                            style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                    );
                })}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {total}
                </span>
                <span className="text-[10px] font-medium text-neutral-400 dark:text-dark-text-secondary uppercase tracking-wide">
                    Total
                </span>
            </div>
        </div>
    );
}

export function DoughnutLegend({ data, nameKey = 'type', valueKey = 'count', colorKey }) {
    const colorPalette = ['#E30613', '#FFD54F', '#16A34A', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'];

    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colorPalette[i % colorPalette.length] }} />
                        <span className="text-xs font-medium text-neutral-600 dark:text-dark-text-secondary capitalize truncate">
                            {d[nameKey]}
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white tabular-nums">
                        {d[valueKey].toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
}
