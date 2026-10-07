# Captured.YXE

Single Next.js application (App Router) for the Captured.YXE marketing site and admin portal. Data is stored in **MongoDB Atlas**; uploads use **Cloudinary**.

## Requirements

- Node.js 20+ (LTS recommended)
- npm
- MongoDB Atlas cluster
- Cloudinary account (admin uploads)
- Optional SMTP for enquiry notifications

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed
npm run create-admin
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Environment

See `.env.example`. Required for production:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas connection string |
| `MONGODB_DB_NAME` | Database name |
| `AUTH_SECRET` | Session signing (32+ characters) |
| `SITE_URL` | Canonical site origin |
| `CLOUDINARY_*` | Signed uploads in admin |

Bootstrap only (do not commit real values):

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used by `npm run create-admin` only

## MongoDB Atlas

1. Create a cluster and database user with read/write on your database.
2. Network access: allow your deployment IPs (or `0.0.0.0/0` for development only).
3. Set `MONGODB_URI` and `MONGODB_DB_NAME` in `.env`.
4. Run `npm run seed` once (idempotent; does not overwrite existing documents).
5. Run `npm run create-admin` to create or reset an admin password.

## Admin

- Login: `/admin/login`
- No public registration. Create admins only via `npm run create-admin`.
- Change password: run `create-admin` again with a new `ADMIN_PASSWORD`, or update the hash in Atlas manually.

## Cloudinary

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Admin signed upload endpoint: `POST /api/admin/cloudinary/sign` (authenticated).

Gallery and media records store Cloudinary URLs and public IDs in MongoDB.

## Optional SMTP

When `SMTP_*` and `ADMIN_NOTIFY_EMAIL` are set, new enquiries and booking requests trigger a notification. Records are always saved even if email fails; `notificationSent` reflects delivery.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run seed` | Seed default content (idempotent) |
| `npm run create-admin` | Create/update admin user |
| `npm run sync-images` | Update MongoDB services & gallery with brand photos in `public/images` |

## Public pages (12)

`/`, `/about`, `/services`, `/contact`, `/testimonials`, `/pricing`, `/booking`, `/our-team`, `/gallery`, `/faq`, `/weddings`, `/corporate-events`

## Local preview without Atlas

If `MONGODB_URI` is unset, the public site shows **read-only preview content** and a banner. Forms and admin mutations return honest errors until the database is configured.

## Pending client confirmation

- Standard package: whether instant physical prints are included
- Signature / Elite inclusion mapping (flagged in seed data)
- Add-on quantities and pricing units
- Christmas offer dates and eligibility rules
- Instagram / Facebook profile URLs
- Approved team profiles and published testimonials
- Real booth and on-site event photography (replace Unsplash placeholders)

## Missing assets

- Additional approved event photos for gallery and hero sections
- Optional dark-background logo variant (currently logo on ivory surfaces)

## Production deployment

### Pre-flight

```bash
npm ci
npm run lint
npm run build
```

`npm run build` must finish with no TypeScript errors. Fix ESLint issues before shipping.

### Environment (hosting dashboard)

Set the same variables as `.env.example`. **Required:**

- `MONGODB_URI`, `MONGODB_DB_NAME`
- `AUTH_SECRET` (32+ random characters; rotate if ever exposed)
- `SITE_URL` (public origin, e.g. `https://captured.yxe` — no trailing slash)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**After first deploy:**

1. `npm run seed` (against production URI, from CI or a one-off shell)
2. `npm run create-admin` (set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in the shell env only)
3. Optional: `npm run sync-images`

### Run

| Platform | Command |
|----------|---------|
| Vercel | Connect repo; set env vars; build `npm run build`, output Next default |
| Node VPS | `npm run build` then `NODE_ENV=production npm run start` (port `3000` or `PORT`) |

- Allow your host’s egress IPs in **MongoDB Atlas → Network Access**.
- Do **not** commit `.env` or real `ADMIN_PASSWORD` values.
- Brand logo lives in `public/logo.png` (header/footer); replace that file to change branding without DB changes.

### Smoke test

- Home, booking form submit, contact form submit
- `/admin/login` and one CRUD screen
- `robots.txt` and `sitemap.xml`
