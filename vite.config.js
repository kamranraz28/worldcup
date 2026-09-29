import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig(({ mode }) => {
    // Read every key from .env (empty prefix) so the asset base always matches
    // the host the app is served from.
    const env = loadEnv(mode, process.cwd(), '');
    const assetUrl = (env.ASSET_URL || env.APP_URL || '').replace(/\/+$/, '');

    return {
        // Without this the base is baked into the bundle and every lazy-loaded
        // route chunk is fetched from the wrong host.
        base: `${assetUrl}/build/`,
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
                refresh: true,
            }),
        ],
        esbuild: {
            jsx: 'automatic',
        },
    };
});
