import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryUploader({ eventId, gallery, onUpload, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      await fetch(`/events/${eventId}/gallery`, { method: 'POST', body: formData, headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } });
      if (onUpload) onUpload();
    } finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async (galleryId) => {
    if (!confirm('Remove this image from gallery?')) return;
    await fetch(`/events/${eventId}/gallery/${galleryId}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content } });
    if (onDelete) onDelete();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Gallery</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="btn-secondary h-9 px-4 text-sm inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOpen ? 'Close' : 'Add Images'}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] hover:border-primary-500/40 hover:bg-primary-500/5 cursor-pointer transition-all">
              <div className="flex flex-col items-center gap-2">
                {uploading ? <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" /> : (
                  <>
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-neutral-500">Drop images here or click to upload</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map((image, index) => (
            <motion.div key={image.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] card-premium">
              <img src={`/storage/${image.image_path}`} alt={image.caption || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <button onClick={() => handleDelete(image.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all active:scale-90">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {image.caption && <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent"><p className="text-xs text-white/80 truncate">{image.caption}</p></div>}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white/70">{index + 1}</div>
            </motion.div>
          ))}
        </div>
      )}

      {!isOpen && gallery.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-dark-muted border border-neutral-200 dark:border-dark-border flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">No gallery images yet</p>
        </div>
      )}
    </div>
  );
}
