import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import ScannerCamera from '@/Components/CheckIn/ScannerCamera';
import ScanResult from '@/Components/CheckIn/ScanResult';

function QueueItem({ item, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
      <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-dark-text truncate font-mono">{item.qr_code}</p>
        <p className="text-dark-text-secondary">{item.event_title || 'Event'}</p>
      </div>
      <span className="text-dark-text-secondary text-[10px]">{new Date(item.scanned_at).toLocaleTimeString()}</span>
      <button onClick={() => onRemove(item.offline_queue_id)} className="text-red-400 hover:text-red-300">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Scanner({ events, stats, pendingSync, activeEvent, attendance }) {
  const [cameraActive, setCameraActive] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(activeEvent || (events?.[0]?.id || ''));
  const [manualQr, setManualQr] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [queue, setQueue] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const scanTimeoutRef = useRef(null);
  const csrfToken = typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.content : '';

  useEffect(() => { loadOfflineQueue(); }, []);

  const loadOfflineQueue = () => { try { const stored = localStorage.getItem('checkin_offline_queue'); if (stored) setQueue(JSON.parse(stored)); } catch (e) { } };
  const saveOfflineQueue = (items) => { try { localStorage.setItem('checkin_offline_queue', JSON.stringify(items)); } catch (e) { } };

  const performScan = useCallback(async (qrCode, method = 'qr') => {
    if (!selectedEvent || scanning) return;
    setScanning(true); setManualQr('');
    try {
      const res = await fetch('/check-in/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
        body: JSON.stringify({ qr_code: qrCode, event_id: Number(selectedEvent), scan_method: method, device_id: 'web-scanner-' + navigator.userAgent?.slice(0, 30) }),
      });
      const data = await res.json();
      setLastResult(data);
      if (res.ok && data.success) { if ('vibrate' in navigator) navigator.vibrate(200); playBeep(true); }
      else { playBeep(false); }
    } catch (e) {
      const offlineId = 'offline_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      const newItem = { offline_queue_id: offlineId, qr_code: qrCode, event_id: Number(selectedEvent), scan_method: method, scanned_at: new Date().toISOString(), event_title: events?.find(e => e.id === Number(selectedEvent))?.title || '' };
      const newQueue = [...queue, newItem]; setQueue(newQueue); saveOfflineQueue(newQueue);
      setLastResult({ success: false, code: 'OFFLINE_QUEUED', message: 'No connection — queued for sync. ' + (queue.length + 1) + ' items pending.', data: { ticket: { customer: { first_name: 'Offline', last_name: '', initials: '?' } } } });
    } finally { setScanning(false); }
  }, [selectedEvent, scanning, csrfToken, queue, events]);

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

  const handleScan = useCallback((code) => { if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current); scanTimeoutRef.current = setTimeout(() => performScan(code, 'qr'), 300); }, [performScan]);
  const handleManualSubmit = (e) => { e.preventDefault(); if (manualQr.trim()) performScan(manualQr.trim(), 'manual'); };

  const syncQueue = async () => {
    if (queue.length === 0) return; setSyncing(true); setSyncMessage(null);
    try {
      const res = await fetch('/check-in/sync', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken }, body: JSON.stringify({ items: queue }) });
      const data = await res.json(); setSyncMessage(`Synced ${data.synced} of ${data.total} items.`);
      const syncedIds = new Set((data.results || []).filter(r => r.success).map(r => r.offline_queue_id));
      const remaining = queue.filter(item => !syncedIds.has(item.offline_queue_id));
      setQueue(remaining); saveOfflineQueue(remaining);
    } catch (e) { setSyncMessage('Sync failed — try again later.'); }
    finally { setSyncing(false); }
  };

  const removeQueueItem = (id) => { const remaining = queue.filter(item => item.offline_queue_id !== id); setQueue(remaining); saveOfflineQueue(remaining); };
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
            { label: 'Pending Sync', value: pendingSync + queue.length, color: 'text-red-400' },
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

            {queue.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.02] to-transparent"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-amber-400">Offline Queue ({queue.length})</h3>
                  <div className="flex gap-2">
                    <button onClick={syncQueue} disabled={syncing}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-50 transition-all"
                    >{syncing ? 'Syncing...' : 'Sync Now'}</button>
                    <button onClick={() => { setQueue([]); saveOfflineQueue([]); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-dark-text-secondary text-xs border border-white/10 hover:bg-white/[0.05] transition-all">Clear</button>
                  </div>
                </div>
                {syncMessage && <p className="text-xs text-green-400 mb-2">{syncMessage}</p>}
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {queue.map(item => <QueueItem key={item.offline_queue_id} item={item} onRemove={removeQueueItem} />)}
                </div>
              </motion.div>
            )}

            {lastResult?.code === 'OFFLINE_QUEUED' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-amber-500/20 text-center">
                <p className="text-sm text-amber-400">{lastResult.message}</p>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
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
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Offline scans are queued locally</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Sync pending items when connected</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Green = success, Red = failed</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
      <ScanResult result={lastResult} onClose={clearResult} onRetry={clearResult} />
    </AppLayout>
  );
}
