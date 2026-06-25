import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentViewer({ label, imagePath }) {
  if (!imagePath) return null;

  const url = `/storage/${imagePath}`;

  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
      <div className="aspect-[3/2] relative">
        <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-xs text-white/80 font-medium">{label}</p>
      </div>
    </div>
  );
}
