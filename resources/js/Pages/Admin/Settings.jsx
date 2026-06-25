import { useState } from 'react';
import { router } from '@inertiajs/inertia';
import { motion } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessage from '@/Components/FlashMessage';

function SettingsForm({ group, definition, settings, onSave, saving }) {
  const [values, setValues] = useState({ ...settings });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => { setValues((prev) => ({ ...prev, [key]: value })); setErrors((prev) => ({ ...prev, [key]: null })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(group, values); };
  const fields = definition.fields || {};
  const inputClass = (field) => `w-full px-4 py-2.5 input-field ${errors[field] ? 'border-red-500/50 bg-red-500/5' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {Object.entries(fields).map(([key, field]) => {
        const val = values[key] !== undefined ? values[key] : field.default || '';
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">
              {field.label}
              {field.description && <span className="ml-2 text-[10px] text-neutral-500 font-normal">— {field.description}</span>}
            </label>
            {field.type === 'boolean' ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={val === 'true' || val === true} onChange={(e) => handleChange(key, e.target.checked ? 'true' : 'false')} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-white/[0.08] peer-checked:bg-primary-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            ) : field.type === 'color' ? (
              <div className="flex items-center gap-3">
                <input type="color" value={val || '#000000'} onChange={(e) => handleChange(key, e.target.value)} className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-white/10 bg-transparent cursor-pointer" />
                <input type="text" value={val} onChange={(e) => handleChange(key, e.target.value)} className={`flex-1 ${inputClass(key)} font-mono`} />
              </div>
            ) : field.type === 'select' ? (
              <select value={val} onChange={(e) => handleChange(key, e.target.value)} className={`${inputClass(key)}`}>
                {(field.options || []).map((opt) => {
                  const optVal = typeof opt === 'object' ? Object.keys(opt)[0] : opt;
                  const optLabel = typeof opt === 'object' ? Object.values(opt)[0] : opt;
                  return <option key={optVal} value={optVal}>{optLabel}</option>;
                })}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea value={val} onChange={(e) => handleChange(key, e.target.value)} rows={4} className={`${inputClass(key)} resize-none`} />
            ) : field.type === 'range' ? (
              <div className="flex items-center gap-3">
                <input type="range" min={field.min || 0} max={field.max || 1} step={field.step || 0.01} value={val} onChange={(e) => handleChange(key, e.target.value)} className="flex-1 accent-primary-500" />
                <span className="text-sm text-neutral-500 font-mono w-12 text-right">{val}</span>
              </div>
            ) : (
              <input type={field.type || 'text'} value={val} onChange={(e) => handleChange(key, e.target.value)} placeholder={field.default || ''} className={inputClass(key)} />
            )}
            {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
          </div>
        );
      })}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary h-10 px-6 text-sm">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {group === 'smtp' && (
          <button type="button" onClick={() => fetch('/admin/settings/test-smtp', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content } }).then(r => r.json()).then(d => alert(d.message))}
            className="btn-secondary h-10 px-4 text-sm">Test Connection</button>
        )}
        {group === 'sms' && (
          <button type="button" onClick={() => fetch('/admin/settings/test-sms', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content } }).then(r => r.json()).then(d => alert(d.message))}
            className="btn-secondary h-10 px-4 text-sm">Test SMS</button>
        )}
      </div>
    </form>
  );
}

export default function Settings({ definitions, settings }) {
  const [activeTab, setActiveTab] = useState(Object.keys(definitions || {})[0] || 'general');
  const [saving, setSaving] = useState(false);
  const handleSave = (group, values) => {
    setSaving(true);
    router.post(`/admin/settings/${group}`, { settings: values }, {
      onSuccess: () => setSaving(false), onError: () => setSaving(false), onFinish: () => setSaving(false),
    });
  };
  const groupKeys = Object.keys(definitions || {});
  const activeDef = definitions?.[activeTab];

  return (
    <AdminLayout>
      <FlashMessage />
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Settings</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-text-secondary mt-1">Configure application settings across all modules</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 border-b border-neutral-100 dark:border-white/10 pb-px">
          {groupKeys.map((key) => {
            const d = definitions?.[key];
            const isActive = activeTab === key;
            return (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
                  isActive ? 'bg-white dark:bg-dark-surface text-primary-500 border border-neutral-200 dark:border-white/10 border-b-transparent' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-dark-text hover:bg-white/[0.02]'
                }`}
              >
                {d?.icon && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={d.icon} /></svg>}
                {d?.label || key}
              </button>
            );
          })}
        </div>

        {activeTab && activeDef && (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-white/5">
              {activeDef.icon && (
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={activeDef.icon} /></svg>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{activeDef.label} Settings</h2>
                <p className="text-xs text-neutral-500">Configure {activeDef.label.toLowerCase()} preferences for the application</p>
              </div>
            </div>
            <SettingsForm group={activeTab} definition={activeDef} settings={settings?.[activeTab] || {}} onSave={handleSave} saving={saving} />
          </motion.div>
        )}

        {activeTab === 'maintenance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.02] to-transparent"
          >
            <h3 className="text-sm font-semibold text-amber-400 mb-3">Maintenance Mode Quick Actions</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => { if (confirm('Enable maintenance mode? Users will be locked out.')) { router.post('/admin/settings/toggle-maintenance', { enabled: true }); } }}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-all">Enable Maintenance</button>
              <button onClick={() => { router.post('/admin/settings/toggle-maintenance', { enabled: false }); }}
                className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all">Disable Maintenance</button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
