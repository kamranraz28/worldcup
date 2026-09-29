import { motion } from 'framer-motion';

/* Deterministic particle layout (avoids re-randomizing on each render) */
const PARTICLES = Array.from({ length: 26 }).map(() => ({
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 12 + Math.random() * 15,
    delay: Math.random() * 8,
}));

/**
 * Animated aurora background shared by every public page: drifting colour
 * blobs over a faint grid + dot texture, plus slow rising particles.
 */
export default function PublicAuroras() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-grid opacity-60 mask-fade-bottom" />
            <div className="absolute inset-0 bg-dots opacity-40 mask-fade-bottom" />

            <motion.div
                className="absolute -top-40 -left-32 h-[560px] w-[560px] rounded-full bg-primary-500/[0.14] blur-[140px]"
                animate={{ x: [0, 30, 0], y: [0, 24, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div
                className="absolute -top-20 right-[8%] h-[480px] w-[480px] rounded-full bg-blue-500/[0.11] blur-[130px]"
                animate={{ x: [0, -34, 0], y: [0, 28, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div
                className="absolute top-1/3 left-[42%] h-[420px] w-[420px] rounded-full bg-gold-400/[0.08] blur-[130px]"
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div
                className="absolute bottom-[12%] -right-24 h-[520px] w-[520px] rounded-full bg-green-500/[0.08] blur-[140px]"
                animate={{ y: [0, -26, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div
                className="absolute bottom-1/4 left-[-10%] h-[380px] w-[380px] rounded-full bg-fuchsia-500/[0.07] blur-[120px]"
                animate={{ scale: [1, 1.1, 1], x: [0, 22, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />

            {PARTICLES.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }}
                    animate={{ y: [0, -34, 0], opacity: [0, 0.08, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
                />
            ))}
        </div>
    );
}