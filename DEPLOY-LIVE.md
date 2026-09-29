# Deploy TicketClub to production — https://ticketclub.my

This guide covers deploying the app to a **cPanel shared host** with **ticketclub.my**
as the primary (or addon/aliased) domain. The app is built to run **from the document
root** (no `/public` subfolder needed): the root `index.php` + `.htaccess` route
everything, and static assets are mapped from `public/`.

---

## 0. Checklist — do these locally before uploading

- [ ] `composer install --no-dev --optimize-autoloader` (or upload `vendor/` as-is)
- [ ] `npm install && npm run build` → keeps `public/build`
- [ ] **Delete `public/hot` if it exists** (it's created by `npm run dev`; uploads it
      and the live site will try to load assets from your local dev server).
- [ ] Do **not** upload: `node_modules/`, `worldcup` (leftover SQLite file), `.git/`,
      `.env`, `tests/`, `.phpunit.*`.
- [ ] Fill in the real values in your copy of `.env.production` (next section).

---

## 1. Server requirements

- **PHP 8.2 or newer** — cPanel → *MultiPHP Manager* → select ticketclub.my.
- Extensions (cPanel → *Select PHP Version* → Extensions), enable: `gd`, `dom`,
  `xml`, `mbstring`, `curl`, `zip`, `openssl`, `fileinfo`, `pdo_mysql`,
  `intl`, `bcmath`. Enable `imagick`/`gmp` too if shown.

## 2. DNS → SSL

- Point `ticketclub.my` (+ `www`) A/AAAA records at the server.
- Issue the SSL certificate (cPanel → *SSL/TLS Status*, or AutoSSL).
- cPanel → domain → enable **Force HTTPS** (the `.htaccess` also redirects as a fallback).

## 3. Create the database

cPanel → **MySQL® Databases**:
1. Create a database, e.g. `<your-cpanel-user>_ticketclub`.
2. Create a user, add it to the database with **ALL privileges**.
3. Keep the values — they go into `.env` (`DB_DATABASE`, `DB_USERNAME`,
   `DB_PASSWORD`). MySQL host is usually `localhost`.

## 4. Upload the project

Make sure **all files go directly into the document root** of `ticketclub.my`
(e.g. `public_html/`): `public_html/index.php`, `public_html/.htaccess`,
`public_html/artisan`, etc. **Do not** put the project in a subfolder like
`public_html/ems` — the whole web root is the app.

ZIP the project (excluding the items in section 0) → upload → extract in
**File Manager**.

## 5. `.env` (production)

1. Upload `.env.production` into the document root and rename it to `.env`
   (or use File Manager → *+ File* → name it `.env`), then paste the values.
2. Fill in the `CHANGE_ME_*` values:
   - `DB_*` — the cPanel MySQL credentials from step 3.
   - `MAILGUN_SECRET` — your Mailgun API signing key.
   - `SHURJOPAY_USERNAME` / `SHURJOPAY_PASSWORD` — your live ShurjoPay merchant creds.
3. `APP_KEY` is already set. If you ever rotate it: `php artisan key:generate`.
4. Confirm `APP_URL=https://ticketclub.my` and `APP_DEBUG=false`.

> **Do not** commit this file — it now has production secrets. It's git-ignored.

## 6. Database schema + data

Pick ONE of:

**A. Run migrations + seeders (fresh install)**
```bash
php artisan migrate --force
php artisan db:seed --force
```
`db:seed` creates the roles/permissions, admin/scanner users and demo data.

**B. Import your local database**
- phpMyAdmin → select your new DB → **Import** → upload a `.sql` dump exported
  from your local `ems` MySQL database (tables + any data) → **Go**.
- Then run `php artisan migrate --force` so any newer migrations (e.g. the
  verification-removal cleanup) apply to the imported schema.

## 7. Storage & caches (first run)

```bash
chmod -R 755 storage bootstrap/cache
# Make uploaded/report files publicly reachable:
php artisan storage:link
# Or create public/storage as a real folder if symlinks are blocked.
```

After the app is up, cache the config/routes/views for speed:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```
(If you later edit anything in `config/` or `routes/`, run `php artisan optimize:clear`
then re-cache.)

## 8. Post-deploy verification

- [ ] `https://ticketclub.my` loads and redirects from `http://`.
- [ ] Login as the seeded admin (see below) → dashboard weighs in.
- [ ] `https://ticketclub.my/up` returns `ok` (Laravel health check).
- [ ] Upload an event banner / generate a report (exercises `storage/` + PDF).
- [ ] Make a test payment through ShurjoPay sandbox→live when creds are set.
- [ ] Buy a ticket → ticket email arrives via Mailgun.

**Change the seeded passwords immediately** — seeded logins:
`superadmin@synergyinterface.com` / `password`, `admin@synergyinterface.com` /
`password`, `scanner@synergyinterface.com` / `password`.

---

## Notes / troubleshooting

- **400/500 on all pages** → `storage/logs` not writable, or `.env` has wrong
  `APP_KEY`/DB creds. Check `storage/logs/laravel.log`.
- **Broken CSS/JS** → make sure `public/build` was uploaded and `public/hot` is
  gone. If assets were rebuilt meanwhile, re-run `npm run build`.
- **404 for `/storage/...`** → run `php artisan storage:link` (or create the
  `public/storage` folder).
- **Emails not sending** → Mailgun domain verified in Mailgun + `MAILGUN_SECRET`
  set. US region endpoint is `api.mailgun.net`; EU is `api.eu.mailgun.net`.
- **Sessions not working / login loops** → `sessions` table must exist (run
  migrations) and `SESSION_SECURE_COOKIE=true` is fine because the site is
  fully HTTPS.
- **www vs non-www**: use one canonical host. The `.htaccess` only forces
  HTTPS; optionally add a `www`→apex (or apex→`www`) `RewriteRule`, and keep
  `APP_URL`/`SESSION_DOMAIN` consistent.
- **Queues**: `QUEUE_CONNECTION=sync` runs report exports inline — fine for
  shared hosting. If you move to a VPS later, switch to `database` and run a
  worker (`php artisan queue:work`).