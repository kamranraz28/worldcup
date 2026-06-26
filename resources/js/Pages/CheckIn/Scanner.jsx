import { useState, useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import ScannerCamera from '@/Components/CheckIn/ScannerCamera';

export default function Scanner({ auth, events, stats, activeEvent, attendance, scannerBeepEnabled: initialBeep = true }) {
  const [cameraActive, setCameraActive] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(activeEvent || (events?.[0]?.id || ''));
  const [manualQr, setManualQr] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [scannerBeepEnabled, setScannerBeepEnabled] = useState(initialBeep);
  const scanTimeoutRef = useRef(null);
  const csrfToken = typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.content : '';

  const scanUrl = () => window.route ? route('checkin.scan') : '/check-in/scan';

  const submitScan = useCallback(async (qrCode) => {
    if (!selectedEvent || scanning) return;
    setScanning(true); setManualQr('');
    try {
      const res = await fetch(scanUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
        body: JSON.stringify({ qr_code: qrCode, event_id: Number(selectedEvent) }),
      });
      if (res.status === 419) {
        setLastResult({ success: false, code: 'SESSION_EXPIRED', message: 'Session expired. Please refresh.', data: null });
        if (scannerBeepEnabled) playBeep(false); return;
      }
      const data = await res.json();
      setLastResult(data);
      if (res.ok && data.success) { if ('vibrate' in navigator) navigator.vibrate(200); if (scannerBeepEnabled) playBeep(true); }
      else { if (scannerBeepEnabled) playBeep(false); }
    } catch (e) {
      setLastResult({ success: false, code: 'ERROR', message: 'Connection error. Try again.', data: null });
      if (scannerBeepEnabled) playBeep(false);
    } finally { setScanning(false); }
  }, [selectedEvent, scanning, csrfToken, scannerBeepEnabled]);

  const playBeep = (success) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = success ? 1200 : 400; osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (success ? 0.15 : 0.3));
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + (success ? 0.15 : 0.3));
    } catch (e) { }
  };

  const handleScan = useCallback((code) => {
    setManualQr(code);
    setCameraActive(false);
    if (scannerBeepEnabled) playBeep(true);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    scanTimeoutRef.current = setTimeout(() => submitScan(code), 300);
  }, [submitScan, scannerBeepEnabled]);

  const handleManualSubmit = (e) => { e.preventDefault(); if (manualQr.trim()) submitScan(manualQr.trim()); };

  const clearResult = () => setLastResult(null);
  const selectedEventObj = events?.find(e => e.id === Number(selectedEvent));

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">QR Scanner</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Scan tickets for entry — FIFA World Cup 2026</p>
          </div>
          <Link href="/check-in/history" className="btn-secondary h-10 px-5 text-sm">History</Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Today', value: stats?.today || 0, color: 'text-green-400' },
            { label: 'Valid', value: stats?.valid_today || 0, color: 'text-blue-400' },
            { label: 'Unique', value: stats?.unique_customers_today || 0, color: 'text-amber-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <p className="text-xs text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="input-field px-3 py-2 text-sm">
                    <option value="">Select Event</option>
                    {events?.map(e => <option key={e.id} value={e.id}>{e.title} — {e.venue_name}</option>)}
                  </select>
                  <button onClick={() => setCameraActive(!cameraActive)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${cameraActive ? 'btn-primary' : 'btn-secondary'}`}>
                    {cameraActive ? 'Camera On' : 'Camera Off'}
                  </button>
                </div>
                {attendance && (
                  <div className="text-right text-xs text-neutral-500">
                    <span className="text-green-400 font-medium">{attendance.valid_checkins}</span> / {attendance.confirmed_tickets} checked in
                    <span className="ml-2 text-amber-400">({attendance.attendance_rate}%)</span>
                  </div>
                )}
              </div>
              <ScannerCamera onScan={handleScan} active={cameraActive && !!selectedEvent} eventId={selectedEvent} />
              <form onSubmit={handleManualSubmit} className="mt-4">
                <div className="flex gap-2">
                  <input type="text" value={manualQr} onChange={(e) => setManualQr(e.target.value)}
                    placeholder="Or enter QR code manually..." readOnly={scanning}
                    className="flex-1 input-field font-mono" />
                  <button type="submit" disabled={!manualQr.trim() || scanning} className="btn-primary px-5">
                    {scanning ? 'Scanning...' : 'Check In'}
                  </button>
                </div>
              </form>
            </motion.div>

            {lastResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`glass-card p-4 text-center ${lastResult.success ? 'border-green-500/20' : 'border-red-500/20'}`}>
                <p className={`text-sm font-medium mb-3 ${lastResult.success ? 'text-green-400' : 'text-red-400'}`}>{lastResult.message}</p>
                <button onClick={() => { setLastResult(null); setCameraActive(true); }}
                  className="btn-primary px-6 py-1.5 text-sm">Scan Next</button>
              </motion.div>
            )}

            {attendance && selectedEventObj && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Attendance — {selectedEventObj.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Confirmed</span><span className="text-dark-text font-medium">{attendance.confirmed_tickets}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Checked In</span><span className="text-green-400 font-medium">{attendance.valid_checkins}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Remaining</span><span className="text-amber-400 font-medium">{attendance.remaining}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Duplicates</span><span className="text-red-400 font-medium">{attendance.duplicate_checkins}</span></div>
                  <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-white/[0.04]">
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-white/[0.05] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500" style={{ width: Math.min(attendance.attendance_rate, 100) + '%' }} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 text-right">{attendance.attendance_rate}% attendance rate</p>
                  </div>
                </div>
              </motion.div>
            )}

            {stats?.hourly_breakdown && Object.keys(stats.hourly_breakdown).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Hourly Check-Ins</h3>
                <div className="space-y-1">
                  {Object.entries(stats.hourly_breakdown).map(([hour, count]) => (
                    <div key={hour} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-neutral-500">{hour}:00</span>
                      <div className="flex-1 h-3 rounded-full bg-neutral-100 dark:bg-white/[0.03] overflow-hidden">
                        <div className="h-full rounded-full bg-primary-500/40 transition-all" style={{ width: Math.min((count / Math.max(...Object.values(stats.hourly_breakdown))) * 100, 100) + '%' }} />
                      </div>
                      <span className="w-6 text-neutral-500 dark:text-dark-text text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider mb-3">Quick Tips</h3>
              <ul className="text-xs text-neutral-500 dark:text-dark-text-secondary space-y-1.5">
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Point camera at QR code on ticket</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Auto-detects QR codes via native BarcodeDetector</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Green = success, Red = failed</li>
              </ul>
              {auth?.user?.role?.name === 'super-admin' && (
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-dark-text">Scanner Beep Sound</p>
                      <p className="text-xs text-neutral-500">Play beep on QR detection</p>
                    </div>
                    <input type="checkbox" checked={scannerBeepEnabled} onChange={(e) => {
                      const enabled = e.target.checked;
                      setScannerBeepEnabled(enabled);
                      fetch(route('checkin.toggle-beep'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content, 'Accept': 'application/json' },
                        body: JSON.stringify({ enabled }),
                      });
                    }} className="sr-only peer" />
                    <div className="relative w-11 h-6 rounded-full bg-white/[0.08] peer-checked:bg-primary-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
