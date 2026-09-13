# Deploy to cPanel (shared hosting) at http://synergyinterface.com/ems

The app is prepared to run as a **subdirectory** (`/ems`) under your cPanel document root
(`public_html`). No domain / subdomain / addon domain is needed.

## What was added to the project

| File | Purpose |
| --- | --- |
| `index.php` (project root) | Laravel front controller for subdirectory hosting (works with `public/index.php`) |
| `.htaccess` (project root) | Rewrites `/ems/...` into the app; maps `build/`, `storage/`, `images/` to `public/` |
| `.env` | Production environment + your database credentials (upload as-is — it already has everything) |
| Everything else | All URLs in the app are subdirectory-aware (require `APP_URL` below to include `/ems`) |

---

## 1. Server requirements

- **PHP 8.2 or newer** — set it in cPanel → *MultiPHP Manager* → select the domain.
- Enable required PHP extensions in cPanel → *Select PHP Version* → Extensions:
  `gd` (QR codes), `dom`, `xml`, `mbstring`, `curl`, `zip`, `openssl`, `fileinfo`, `pdo_mysql`.
  (Enable `imagick`/`gmp` too if shown.)

## 2. Create the database

cPanel → **MySQL® Databases**:

1. **Create database:** `synergy1_ems`
2. **Create user:** `synergy1_kamran` with password `18102017@Kamran`
3. **Add user to database:** select `synergy1_ems` → all privileges → *Add*

> The MySQL host is `localhost` (already set in `.env`).

## 3. Upload the project

- Build the frontend assets **before** uploading (assets are pre-built, but if you changed anything):
  run `npm install && npm run build` locally and keep the `public/build` folder.
- **Do NOT upload** `node_modules` (large, not needed on the server). It is fine to upload `vendor/`
  as-is (Composer dependencies), or run `composer install --no-dev` on the server if available.
- **Make sure `public/hot` does NOT exist in the upload.** That file is created by `npm run dev`
  locally and would point the live site at `http://[::1]:5173` (your local Vite server), breaking
  all CSS/JS on the server. Delete it from the zip if present.
- Upload the project so that **all files go directly inside `public_html/ems`**.
  i.e. `public_html/ems/.htaccess`, `public_html/ems/index.php`, `public_html/ems/artisan`, etc.
- Recommended: ZIP the project (excluding `node_modules`) → upload → extract in cPanel
  **File Manager** inside `public_html/ems`.

## 4. Configure

1. Upload the **`.env`** file into `public_html/ems/` — it already contains the production
   settings and the `synergy1_ems` database credentials.
   - ⚠️ Dotfiles are often skipped when zipping/uploading on Windows. After upload, enable
     **File Manager → Settings → Show Hidden Files** and confirm `public_html/ems/.env` exists.
   - If it's missing, File Manager → **+ File** → name it `.env`, open it, and paste the contents
     of the local `.env`. (It must NOT be named `.env.txt`.)
2. If your mail provider is different, edit `MAIL_*` later (ticket emails). Default = `log`.

## 5. Set up the database WITHOUT Terminal

No Shell/Terminal access is required — Laravel reads `.env` fresh on every request (no
`config:clear` needed, and there's no cached config on first deploy).

1. **Import the database** (skip migrations/seeders entirely):
   - phpMyAdmin → select **`synergy1_ems`** → **Import** → choose your local DB dump
     (a `.sql` exported from your local `ems` database) → **Go**.
   - The dump must contain the app tables (`users`, `sessions`, `events`, `registrations`,
     `roles`, `permissions`, …) plus the seeded admin users.
   - Verify the table count inside `synergy1_ems` after import (expect 15+ tables).
2. **Permissions**: by default cPanel's files are owned by your account and writable — only fix
   if the app complains. File Manager → right-click `storage` and `bootstrap/cache` →
   **Change Permissions** → **755** if needed.
3. **Uploaded files / ticket media** (optional, only if storage is used): create
   `public_html/ems/public/storage` as a real folder. No symlink needed for a working login page.

## 6. Done — open the app

- URL: **https://synergyinterface.com/ems**
- Seed login: `superadmin@synergyinterface.com` / `password`
  (change it after first login! Also `admin@synergyinterface.com` / `password`
  and `scanner@synergyinterface.com` / `password`)

---

## Notes / troubleshooting

- **Route / link broken?** The app needs `APP_URL` (and `ASSET_URL`) to include `/ems`. If you ever
  change the location, update both in `.env` and run `php artisan config:clear` (and `config:cache`).
- **404 for `/ems/storage/...`**: the storage link/folder is missing — see step 5 (create
  `public_html/ems/public/storage` as a folder, or a symlink if your host allows it).
- **Whitespace/`headers already sent` errors**: make sure `storage/logs` is writable and no
  stray BOM exists in files.
- **Queued jobs**: `QUEUE_CONNECTION=sync` is set so report exports run instantly without a queue
  worker. Sessions are stored in the database (no file-permissions issues).
- **HTTPS later**: if you enable SSL, change `APP_URL`/`ASSET_URL` to `https://...` and optionally
  set `SESSION_SECURE_COOKIE=true`.
- **PHP version mismatch**: this app requires PHP ≥ 8.2 (set via MultiPHP Manager).