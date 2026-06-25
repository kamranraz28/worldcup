import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LineChart({ data, xKey = 'date', series, height = 200, className = '' }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(true); }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-xs text-neutral-400">No data available</p>
      </div>
    );
  }

  const padding = { top: 16, right: 12, bottom: 24, left: 8 };
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

  const colors = ['#E30613', '#3B82F6', '#16A34A', '#FFD54F'];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
        {[0, 0.5, 1].map((ratio) => {
          const y = padding.top + plotHeight * (1 - ratio);
          return (
            <g key={ratio}>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y}
                stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
              <text x={padding.left - 4} y={y + 3} textAnchor="end"
                className="text-[8px] fill-neutral-400 dark:fill-dark-text-secondary/50" opacity={0.6}>
                {Math.round(minVal + range * ratio)}
              </text>
            </g>
          );
        })}

        {series.map((s, si) => {
          const points = data.map((d, i) => `${xScale(i)},${yScale(d[s.key])}`).join(' ');
          return (
            <g key={s.key}>
              <motion.path
                d={`M${points}`}
                fill="none"
                stroke={colors[si % colors.length]}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animated ? 1 : 0 }}
                transition={{ duration: 0.8, delay: si * 0.1, ease: [0.25, 1, 0.5, 1] }}
              />
              {animated && data.map((d, i) => (
                <motion.circle key={i} cx={xScale(i)} cy={yScale(d[s.key])} r={2.5}
                  fill={colors[si % colors.length]} stroke="white" strokeWidth={1.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.02, type: 'spring', stiffness: 200 }}
                />
              ))}
            </g>
          );
        })}

        {data.map((d, i) => {
          const skip = data.length > 12 ? Math.ceil(data.length / 6) : 1;
          if (i % skip !== 0 && i !== data.length - 1) return null;
          return (
            <text key={i} x={xScale(i)} y={chartHeight - 4} textAnchor="middle"
              className="text-[8px] fill-neutral-400 dark:fill-dark-text-secondary/50">{d[xKey]}
            </text>
          );
        })}

        {series.length > 1 && (
          <g>
            {series.map((s, si) => (
              <g key={s.key}>
                <circle cx={chartWidth - 60 + si * 70} cy={8} r={3} fill={colors[si % colors.length]} />
                <text x={chartWidth - 54 + si * 70} y={11}
                  className="text-[8px] fill-neutral-400 dark:fill-dark-text-secondary/50">{s.label || s.key}</text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
