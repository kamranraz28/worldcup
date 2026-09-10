import { useRef, useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function QRPositionPicker({ pdfUrl, qrX, qrY, qrSize, onChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [page, setPage] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [renderedWidth, setRenderedWidth] = useState(0);
  const [renderedHeight, setRenderedHeight] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert mm to pixels based on rendered scale
  const mmToPx = useCallback((mm) => {
    if (!pageWidth) return 0;
    const scale = renderedWidth / pageWidth;
    return mm * (72 / 25.4) * scale;
  }, [pageWidth, renderedWidth]);

  // Convert pixels to mm
  const pxToMm = useCallback((px) => {
    if (!pageWidth) return 0;
    const scale = renderedWidth / pageWidth;
    return px / (72 / 25.4) / scale;
  }, [pageWidth, renderedWidth]);

  // Load and render PDF
  useEffect(() => {
    if (!pdfUrl) return;

    setLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1.0 });

        setPage(firstPage);
        setPageWidth(viewport.width);
        setPageHeight(viewport.height);

        // Render at a scale that fits the container (max 600px wide)
        const container = containerRef.current;
        if (!container) return;
        const maxWidth = container.clientWidth || 600;
        const scale = Math.min(maxWidth / viewport.width, 2.0);
        const scaledViewport = firstPage.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        setRenderedWidth(scaledViewport.width);
        setRenderedHeight(scaledViewport.height);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await firstPage.render({
          canvasContext: ctx,
          viewport: scaledViewport,
        }).promise;

        setLoading(false);
      } catch (err) {
        console.error('PDF render error:', err);
        setError('Failed to render PDF preview');
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  // QR position in pixels (on the rendered canvas)
  const qrPxX = mmToPx(qrX || 0);
  const qrPxY = mmToPx(qrY || 0);
  const qrPxSize = mmToPx(qrSize || 40);

  const handleMouseDown = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mode === 'move') {
      setDragOffset({ x: mouseX - qrPxX, y: mouseY - qrPxY });
      setDragging(true);
    } else {
      setResizing(true);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging && !resizing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(e.clientX - rect.left, renderedWidth));
    const mouseY = Math.max(0, Math.min(e.clientY - rect.top, renderedHeight));

    if (dragging) {
      const newX = Math.max(0, Math.min(mouseX - dragOffset.x, renderedWidth - qrPxSize));
      const newY = Math.max(0, Math.min(mouseY - dragOffset.y, renderedHeight - qrPxSize));
      onChange({
        qr_x: Math.round(pxToMm(newX) * 10) / 10,
        qr_y: Math.round(pxToMm(newY) * 10) / 10,
      });
    }

    if (resizing) {
      const size = Math.max(10, Math.min(mouseX - qrPxX, mouseY - qrPxY, renderedWidth - qrPxX, renderedHeight - qrPxY));
      onChange({
        qr_size: Math.max(10, Math.round(pxToMm(size))),
      });
    }
  }, [dragging, resizing, dragOffset, qrPxSize, qrPxX, qrPxY, renderedWidth, renderedHeight, pxToMm, onChange]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setResizing(false);
  }, []);

  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, resizing, handleMouseMove, handleMouseUp]);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02]">
        <span className="text-xs text-neutral-400">Upload a PDF template first to position the QR code</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-700 dark:text-dark-text uppercase tracking-wider">
          Drag the QR code to position it on your ticket
        </span>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>X: {qrX || 0}mm</span>
          <span>Y: {qrY || 0}mm</span>
          <span>Size: {qrSize || 40}mm</span>
        </div>
      </div>

      <div ref={containerRef} className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-64">
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}
        <canvas ref={canvasRef} className="block max-w-full" />

        {renderedWidth > 0 && (
          <div
            className="absolute border-2 border-dashed border-primary-500 bg-primary-500/10 cursor-move flex items-center justify-center select-none"
            style={{
              left: `${qrPxX}px`,
              top: `${qrPxY}px`,
              width: `${qrPxSize}px`,
              height: `${qrPxSize}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            <svg className="w-1/2 h-1/2 text-primary-500 opacity-60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 11h2v2H3v-2zm0-4h2v2H3V7zm4 4h2v2H7v-2zm0-4h2v2H7V7zm-4 8h2v2H3v-2zm0-4h2v2H3v-2zm8 4h2v2h-2v-2zm0-4h2v2h-2v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm-8 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 19h2v2H7v-2zm0-4h2v2H7v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2zm4 4h2v2h-2v-2zm0-4h2v2h-2v-2z"/>
            </svg>
            {/* Resize handle at bottom-right corner */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-white cursor-se-resize shadow-sm"
              onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-neutral-400">
        Drag the blue square to position. Drag the corner handle to resize. Coordinates update in real-time.
      </p>
    </div>
  );
}
