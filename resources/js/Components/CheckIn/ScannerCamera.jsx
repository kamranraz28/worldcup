import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function ScannerCamera({ onScan, active, eventId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setCameraReady(true); };
      }
    } catch (e) {
      setCameraError('Camera access denied or unavailable. Use manual entry instead.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraReady(false); setDetecting(false);
  }, []);

  useEffect(() => {
    if (active) startCamera(); else stopCamera();
    return stopCamera;
  }, [active, startCamera, stopCamera]);

  useEffect(() => {
    if (!cameraReady || !active || !eventId) return;

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) { animFrameRef.current = requestAnimationFrame(detect); return; }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (window.BarcodeDetector) {
        try {
          const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0) { const code = barcodes[0].rawValue; if (code && !detecting) { setDetecting(true); onScan(code); } }
        } catch (e) {}
      } else {
        try {
          const jsQR = (await import('jsqr')).default;
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data && !detecting) { setDetecting(true); onScan(code.data); }
        } catch (e) {}
      }

      if (active && !detecting) { animFrameRef.current = requestAnimationFrame(detect); }
    };

    animFrameRef.current = requestAnimationFrame(detect);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [cameraReady, active, eventId, onScan, detecting]);

  if (!active) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg shadow-primary-500/10">
      {cameraError ? (
        <div className="flex items-center justify-center h-64 text-red-400 text-sm p-4 text-center">
          <div>
            <svg className="w-10 h-10 mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-white/70">{cameraError}</p>
            <button onClick={startCamera} className="mt-3 px-4 py-2 rounded-xl bg-white/10 text-sm text-white hover:bg-white/20 transition-all">Retry Camera</button>
          </div>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          {detecting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-green-400 text-sm font-semibold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                QR Code Detected!
              </div>
            </motion.div>
          )}
          <div className="absolute inset-0 border-2 border-primary-500/20 pointer-events-none rounded-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-primary-400/30 rounded-xl" />
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-2">
            <span className="text-xs text-white/60 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">QR Scanner Active</span>
            <button onClick={stopCamera} className="text-xs text-red-400 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg hover:bg-red-500/20 transition-all">Stop Camera</button>
          </div>
          {/* Scanning animation */}
          <motion.div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
    </div>
  );
}
