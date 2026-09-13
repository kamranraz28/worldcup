import React from 'react';
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appBase = (() => {
  try {
    const meta = document.querySelector('meta[name="app-base"]');
    const raw = meta?.getAttribute('content') || '';
    if (!raw) return '';
    return raw.startsWith('http') ? new URL(raw).pathname.replace(/\/+$/, '') : raw.replace(/\/+$/, '');
  } catch (e) {
    return '';
  }
})();

window.APP_BASE = appBase;
window.appUrl = (path = '') => `${appBase}${path}`;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#E30613',
    },
});
