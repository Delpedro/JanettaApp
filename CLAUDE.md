# CLAUDE.md

**Read this file at the start of every session. This is the single source of truth.**

---

## 1. SESSION START PROTOCOL

At the start of every session, tell Del:
1. What phase we're in
2. The next concrete action

Then wait for instruction.

---

## 2. THE PROJECT

E-commerce platform for **Janetta** — Joanna's mother, soon-to-be-retired, lives in Poland, Polish-only speaker, techie enough to use a well-designed admin UI.

She handmakes upcycled goods from sticks gathered in the woods, toilet rolls, old children's clothes, and second-hand shop finds. Product range includes decoupage Easter pieces, handmade gnomes (repeatable line, made from scratch), fabric hearts, crochet wall art, decorative heart keepsakes.

**She does not know this is being built.** It's a surprise reveal. If she says no, the project ends.

**Vision:** B2C MVP, architected to scale to family-run operation + B2B wholesale. Think big from day one: best practice, security, scale.

---

## 3. ROLES

- **Del** — tech lead, UAT, decision-maker. The human.
- **Joanna** — photography, finance, business side. Brought in when needed.
- **Janetta** — end user (shop admin). Does not know yet.
- **Claude** — the coder. Executes, doesn't drive.

---

## 4. TECH STACK (LOCKED — DO NOT SUGGEST ALTERNATIVES)

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | Turso (SQLite cloud) |
| Auth | JWT |
| Images | Cloudinary |
| Payments | Stripe + PayPal |
| Hosting | Vercel |
| Repo | GitHub (private) |
| Local dev | Docker + NPM |

**Environment:** Windows, PowerShell in VS Code, Node installed, Git installed, Docker Desktop installed, GitHub account exists.

---

## 5. RULES OF ENGAGEMENT

**One item at a time.** Never jump ahead. Never bundle multiple topics into one response. One task per chat session — when it's done, tell Del to nuke and start a new chat.

**No fluff.** Concise answers. No padding, no "great question," no recapping what Del just said.

**Consistency across sessions.** Monday-Claude and Friday-Claude must be the same Claude. This file is how.

**Challenge structure, not just content.** If a process or file shouldn't exist, say so. Don't just optimise within a bad frame.

**Push back when something's premature, wrong, or fictional.** Don't build docs or features that don't have a real reason to exist yet.

**Best practice, security, and scale from day one.** Never the cheap shortcut that needs rebuilding later.

**Tone:** Direct. Swearing back is fine if Del swears. Otherwise neutral. No corporate softness.

**Never do these:**
- Push to `main` without Del's explicit approval
- Commit secrets, API keys, `.env` files, or credentials
- Run destructive commands (`rm`, `DROP`, force pushes, etc.) without asking first

---

## 6. CURRENT STATE

**Phase:** 3 — Real backend (connecting DB to frontend, replacing mock data).

**Where we are:**
- Scaffold done: `client/` (React 18 + Vite) + `server/` (Node + Express) both exist
- `npm run dev` from root starts both (client `:5173`, server `:3001`) via `concurrently`
- Vite proxies `/api/*` to server in dev
- Server has `/health` endpoint — confirmed working
- Docker + `docker-compose.yml` in place
- `.gitignore` covers `node_modules`, `.env`, `.claude/`, `BUGS.md`, `TDLR.md`
- `server/.env` exists locally with real Turso creds (gitignored). `server/.env.example` has placeholders.
- `react-router-dom` installed, `BrowserRouter` wired in `main.jsx`
- Routing: `/` → `HomePage`, `/product/:id` → `ProductDetailPage`
- Homepage: 6 product cards, PL/EN toggle, warm craft-shop aesthetic — live at `:5173`
- Product detail page: image (left), badge + name + price + description + stock qty + CTA (right). Bilingual. Fully responsive.
- Product cards: image and name are clickable links to detail page
- Pages live in `client/src/pages/`. Components in `client/src/components/`.
- Data: `client/src/data/mockProducts.js` exists but no longer used by any page — can be deleted later
- Cart: `CartContext` (global state), `CartDrawer` (slides in from right), cart icon + badge in header. Add to cart wired on cards and detail page. Qty +/−, remove, running total. UAT confirmed.
- Checkout: `CheckoutPage` at `/checkout`. Guest form (name, email, street, city, postal). Order summary sidebar. Client-side validation. Mock confirmation screen clears cart. Postal code is free-text (no format validation — supports all countries). UAT confirmed.
- All pushed to GitHub (`main`) — 6 commits live
- `BUGS.md` exists (local, gitignored) — all 4 bugs resolved (BUG-001 through BUG-004)
- **Turso DB live:** `jannettasapp` on `aws-eu-west-1`. 4 tables applied: `products`, `users`, `orders`, `order_items`
- **DB schema:** `server/db/schema.sql` (version controlled)
- **DB client:** `server/db/client.js` — `@libsql/client` (latest) wired, reads from `.env`, dotenv loaded here to fix ESM import-order issue
- **`GET /api/products`** — live, queries Turso, returns only published products, normalises to camelCase. UAT confirmed.
- **`GET /api/products/:id`** — live, returns single product or 404.
- **Seed:** `server/db/seed.js` — run once, idempotent, populated DB with 6 mock products. Real product photos now in `client/public/images/` (product1–6.JPEG). UAT confirmed — all 6 load. Cloudinary later.
- `HomePage` and `ProductDetailPage` fetch from API — mock import removed.
- **`POST /api/orders` REMOVED** — old unpaid route bypassed Stripe entirely (fraud vector). Deleted `server/src/routes/orders.js`, removed from `app.js`. All orders must now go through Stripe payment flow.
- `CheckoutPage` POSTs to `POST /api/payments/create-intent`. Loading state, server error handling, bilingual error strings.
- **Auth:** `POST /api/auth/login` — live. Sets httpOnly cookie (`adminToken`, 7d, SameSite=Strict, Secure in prod). Returns `{ user: { id, email, role, forcePasswordReset } }`. Wrong creds → 401. UAT confirmed.
- **JWT middleware:** `server/src/middleware/auth.js` — `requireAuth` reads from cookie. `requireAdmin` checks `role === 'admin'`. Both applied router-level to all `/api/admin/*` routes.
- **`GET /api/auth/me`** — returns current user from cookie. Used by `AdminShell` on mount and `AdminChangePasswordPage` guard.
- **`POST /api/auth/logout`** — clears httpOnly cookie server-side.
- **Rate limiting:** `express-rate-limit` on `POST /api/auth/login` — 10 attempts per IP per 15 min. `trust proxy: 1` set for Vercel.
- **Helmet:** HTTP security headers on all responses.
- **Body size limit:** `express.json({ limit: '10kb' })`.
- **Order total server-side:** `POST /api/orders` fetches prices from DB, verifies products exist + are published + have stock, computes total — client-provided total ignored.
- **First-run setup:** `GET /api/auth/setup/status` + `POST /api/auth/setup` — locks after first admin created. `/setup` page live at client, renders outside shop shell. UAT confirmed.
- **Admin credentials:** Del's in 1Password. Janetta's TBD (when she's told about the project).
- `server/db/create-admin.js` exists but is superseded by `/setup` page — can be deleted later.
- **Admin login:** `/admin/login` — email + password, sets httpOnly cookie, redirects to `/admin/products`. No localStorage token. UAT confirmed.
- `/setup` success screen links to `/admin/login`.
- Both admin routes render outside `ShopShell` (no header/cart/footer).
- **Vite pinned** to port 5173 (`strictPort: true`). Shop footer has small "Admin" link.
- **Admin rebuilt** as proper multi-section layout. `AdminShell` component (sticky header, tab nav: Products | Orders | Add Product | Users | Help, lang toggle, sign out). Child routes: `/admin/products`, `/admin/orders`, `/admin/add-product`, `/admin/users`, `/admin/help`. `/admin/dashboard` redirects to `/admin/products`. Auth check + `force_password_reset` guard in `AdminShell` via `/api/auth/me`.
- **Add Product:** Polish-only form (name, description, price, photo, made-to-order toggle, stock qty, publish toggle). Auto-translates PL→EN via MyMemory API (free, no key needed). Image uploads directly from browser to Cloudinary (signed upload — server generates signature via `GET /api/admin/upload-signature`). `POST /api/admin/products` saves to Turso.
- **Cloudinary wired:** `server/src/lib/cloudinary.js`. Cloud name: `dvcd99acy`. All 6 seed product images migrated to Cloudinary via `server/db/migrate-images.js`. Turso updated with Cloudinary URLs.
- **Product data fixed:** All 6 products have correct names + descriptions matching real Janetta photos. BUG-001 resolved.
- **Forced password reset:** `force_password_reset` column on `users` table. New users always get it set. Login response includes flag → redirects to `/admin/change-password`. `AdminShell` blocks via `/me` check. `PATCH /api/auth/password` updates hash + clears flag. UAT confirmed.
- **MyMemory translation:** `server/src/lib/translate.js` — no API key, free, called server-side on every `POST /api/admin/products`.
- **`multer` + `sharp` installed** on server (image handling). `upload.js` middleware exists but not used on the add-product route (direct-to-Cloudinary bypasses it).
- **`server/.env`** needs: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `TURSO_*`, `JWT_SECRET`, `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`. All in Vercel env vars.
- **Add Product:** UAT confirmed on desktop + iPhone. Navigates to products list on success.
- **iOS cookie fix:** `sameSite: lax` + `path: '/'` — confirmed working on iPhone.
- **Session revocation on password change:** `PATCH /api/auth/password` re-issues fresh JWT cookie after update.
- **Delete user:** `DELETE /api/admin/users/:id` — guards: can't delete self, can't delete last admin. ✕ button in Users tab.
- **`npm run dev`** kills ports 5173/3001 before starting.
- **Edit product:** `GET /api/admin/products/:id` returns full product (incl. descriptions). `PATCH /api/admin/products/:id` handles both quick publish toggle (body has only `published`) and full edit (body has `name_pl` → re-translates, updates all fields). `AdminEditProductPage` at `/admin/edit-product/:id` — pre-filled form, optional image replace, navigates to products list on save. UAT confirmed.
- **Delete product:** `DELETE /api/admin/products/:id`. ✕ button per row in products list. Confirm dialog. Orphaned `order_items.product_id` refs are safe — order_items snapshots name + price at order time. UAT confirmed.
- **Admin login skip:** `AdminLoginPage` checks `/api/auth/me` on mount — if session is live, redirects straight to `/admin/products`. No re-login needed after navigating to shop and back. UAT confirmed.
- **Stripe payments:** `POST /api/payments/create-intent` — validates stock/prices, creates Stripe PaymentIntent, inserts draft order (`status = 'payment_pending'`), returns `clientSecret`. `POST /api/webhooks/stripe` — `payment_intent.succeeded` → update order to `'paid'`, decrement stock; `payment_intent.payment_failed` → mark `'failed'`. Webhook route mounted before `express.json()` (raw body required). `stripe_payment_intent_id` column added to `orders` table.
- **Checkout is now two-step:** (1) fill form → `POST /api/payments/create-intent`, (2) Stripe Payment Element (BLIK + Card + Revolut Pay auto-included). On success → redirects to `/checkout/complete`.
- **`/checkout/complete`:** `CheckoutCompletePage` — retrieves PaymentIntent status from Stripe, shows confirmed/failed, clears cart on success.
- **`client/.env`** has `VITE_STRIPE_PUBLISHABLE_KEY`. `server/.env` has `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
- **Revolut Pay:** Already included automatically by Stripe Payment Element — no separate integration needed.
- **Vercel env vars:** All confirmed in Production and Preview: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`.
- **Vercel CLI installed** — `npm install -g vercel`, linked to `delpedro69/janetta-app`. Use CLI (`vercel env add`) when Vercel UI fails to save sensitive env vars.
- **Transactional email:** `server/src/lib/email.js` — `sendOrderConfirmation()` sends branded Polish HTML to customer; `sendOrderNotificationToAdmin()` sends Polish alert email to `ADMIN_NOTIFICATION_EMAIL` (currently Del's email, will change to Janetta's post-reveal). Both fired from webhook `handlePaymentSucceeded`. Both wrapped in try/catch — email failure does not break payment flow. Test mode: Resend only delivers to account owner regardless of `to` address. Custom domain needed for production.
- **Stripe webhook registered:** Sandbox destination → `https://janetta-app.vercel.app/api/webhooks/stripe`. Listening to `payment_intent.succeeded` + `payment_intent.payment_failed`.
- **UAT confirmed end-to-end:** Payment → webhook → order paid → email in inbox. Live on `janetta-app.vercel.app`.
- **Stripe account owner:** Janetta. Del's sandbox is dev only. Real account set up by Janetta when she says yes to the project.

- **Admin orders list:** `GET /api/admin/orders` — returns last 100 orders with items (json_group_array), newest first. `AdminOrdersPage` at `/admin/orders` — expandable rows showing customer, address, items, total. Status badge (paid/failed/payment_pending/pending). Bilingual.
- **Language toggle persists:** `lang` stored in `localStorage` — survives admin navigation and page refresh.
- **Cart stock warning:** When qty hits max for a stock-tracked item, amber warning shows "Dostępne tylko X szt." / "Only X in stock". Made-to-order items unaffected.
- **Change password link in admin header:** "Change password" / "Zmień hasło" link sits next to email + sign out in `AdminShell` header. Navigates to `/admin/change-password`.

**Help page — what's covered:**
- Login, add product, edit product, hide product, delete product, stock vs made-to-order, change password (link in header), orders notification (email to admin), viewing orders (Orders tab), Stripe payments, photo tips, something not working.
- Missing (not built yet — build before handover):
  - Self-service password reset (forgot password) — Janetta can change password when logged in, but cannot reset if locked out. Needs a forgot-password flow.
  - Discounts / promotional pricing — not built. Parked until post-reveal.
  - Marketing guidance (Facebook, Instagram, TikTok) — out of scope for the app itself. Separate conversation with Joanna post-reveal.

**Next concrete action:**
1. UI/layout overhaul — Del not happy with storefront look (big session, needs Del's direction)
2. Self-service password reset / forgot password (lower urgency)
3. Domain + Resend domain verification (when Janetta says yes)

---

## 7. SHOP REQUIREMENTS (CONFIRMED)

- **Languages:** Both Polish and English. Language toggle on site.
- **Checkout:** Guest only (no customer accounts at MVP).
- **Inventory:** Hybrid — per-product toggle for stock-tracked vs made-to-order.
- **Admin:** Mobile-first, dead simple. Janetta uploads from her phone.
- **Auth:** Admin login only at MVP.

---

## 8. MVP DONE = ALL THREE

1. End-to-end working: admin + storefront + payments
2. Janetta has uploaded 5 products herself, successfully
3. Janetta says yes to launching it

If any of those three fail, MVP is not done.

---

## 9. OPEN QUESTIONS (PARKED — DO NOT REOPEN WITHOUT REASON)

- Brand / shop name
- Multiple images per product (1 vs 3 vs 5)
- Shipping model (flat fee vs tiered vs weight-based)
- Geographic scope (Poland-only vs EU vs worldwide)
- Custom domain vs Vercel subdomain
- Background removal on product images (Joanna's call — does the aesthetic need clean bg or authentic setting?)
- Delivery tracking — how Janetta tracks and fulfils orders. Likely outside the app at first (WhatsApp, notepad, Polish Post). Options: manual (she marks orders done herself), InPost parcel lockers (huge in Poland, label printing), Poczta Polska. Packaging also TBD — branding, inserts, protection for fragile items. Conversation for post-reveal with Janetta + Joanna.
- Marketing — Facebook, Instagram, TikTok. Out of scope for the app. Post-reveal conversation with Joanna.
- WhatsApp business group — Del, Joanna, Janetta. Janetta contacts Del directly via WhatsApp. Create a dedicated WhatsApp Business account/group for the three of them for order issues, support, and coordination. Set up post-reveal.

---

## 10. DECISION LOG

Append every decision here. Newest at the top. Format: `YYYY-MM-DD — decision — short reason`.

- 2026-05-27 — Change password link added to AdminShell header — route existed but had no UI entry point; Janetta couldn't reach it without typing the URL
- 2026-05-27 — Cart stock warning added — + button was silently disabled at max qty with no explanation; amber text now shows remaining stock count
- 2026-05-27 — lang persisted in localStorage — ShopShell unmounts on admin navigation so state was resetting to PL on every return to shop
- 2026-05-27 — POST /api/orders removed — bypassed Stripe entirely, created paid orders without payment; fraud vector; all orders now require Stripe payment intent
- 2026-05-27 — Admin notification email added (sendOrderNotificationToAdmin) — Janetta needs to know when orders come in; ADMIN_NOTIFICATION_EMAIL env var; currently Del's email, changes to Janetta's post-reveal
- 2026-05-27 — Orders list added to admin (GET /api/admin/orders + AdminOrdersPage) — shows all statuses, expandable rows; Janetta needs order visibility in panel
- 2026-05-26 — Revolut Pay included automatically by Stripe Payment Element (Irish account + PLN) — no separate integration needed; drops planned separate Revolut Pay session
- 2026-05-26 — Stripe webhook mounted before express.json() in app.js — Stripe signature verification requires raw body; express.json() would parse and break it
- 2026-05-26 — Stock decremented in webhook (payment_intent.succeeded) not in create-intent — prevents stock going negative if payment never completes
- 2026-05-26 — Draft order inserted at create-intent with status=payment_pending — order exists before payment so we have orderId for reference; flipped to paid in webhook
- 2026-05-26 — Stripe account owned by Janetta — it's her business, her money; Del's sandbox is dev only; real account set up when Janetta says yes
- 2026-05-26 — Resend used for transactional email — free tier, no credit card, onboarding@resend.dev sender for test; custom domain required for production sends to any address
- 2026-05-26 — Email failure does not break payment flow — sendOrderConfirmation wrapped in try/catch in webhook; order still marked paid if email throws
- 2026-05-26 — Stripe sandbox webhook registered as dynamic-wonder — points to janetta-app.vercel.app/api/webhooks/stripe; whsec in Vercel env vars
- 2026-05-26 — No transactional emails yet — confirmation screen text is aspirational; Resend integration is next separate task
- 2026-05-26 — AdminLoginPage checks /api/auth/me on mount and redirects if session live — avoid forcing re-login after navigating shop → admin footer link
- 2026-05-26 — Delete product allowed with orphaned order_items FK — order_items snapshots name/price at order time so history is preserved without the product row
- 2026-05-26 — PATCH /api/admin/products/:id handles both publish toggle and full edit — detected by presence of name_pl in body; keeps existing toggle call sites unchanged
- 2026-05-26 — sameSite: lax on adminToken cookie — iOS WebKit rejects strict on fetch requests; lax still blocks cross-site POSTs so CSRF protection holds
- 2026-05-26 — Add Product redirects to products list on success — Janetta must see the product immediately without manual navigation
- 2026-05-26 — Payments: Stripe + Revolut Pay (drop PayPal) — Revolut has strong Polish market fit; PayPal declining and painful to integrate
- 2026-05-26 — Session revocation via token_version column — increment on password change invalidates all existing sessions; no blacklist needed
- 2026-05-26 — JWT moved to httpOnly cookie (SameSite=Strict, Secure in prod) — localStorage is XSS-vulnerable; cookie approach also enables CSRF protection for free
- 2026-05-26 — Order total computed server-side — client-provided total is a price manipulation vector
- 2026-05-26 — GET /api/auth/me endpoint added — AdminShell needs user info but can't decode httpOnly cookie client-side
- 2026-05-26 — MyMemory used for PL→EN auto-translation (free, no key) — DeepL killed free tier, Anthropic API requires separate billing from claude.ai subscription
- 2026-05-26 — Cloudinary signed upload (browser→Cloudinary direct) — Vercel serverless hard limit is 4.5MB, phone photos exceed this, so image bytes never route through server
- 2026-05-26 — Admin rebuilt as tabbed multi-section layout (Products | Add Product | Users) — single-page dump was not acceptable
- 2026-05-26 — Add Product form is Polish-only — Janetta cannot speak English, translation is automatic
- 2026-05-26 — Forced password reset on all admin-created users — temp password sent via WhatsApp, user must set their own on first login
- 2026-05-22 — Cart drawer with total at bottom confirmed — Del's instinct was to show total earlier in the flow, but drawer pattern is cleaner; confirmed after UAT
- 2026-05-22 — Repo is public, not private — handmade crafts shop, no reason to hide it
- 2026-05-22 — `CLAUDE.md` is the single source of truth (no separate charter/TLDR/instructions) — fewer files, lower context cost, same effect
- 2026-05-22 — Bug log will be `BUGS.md` in repo root, gitignored, local only
- 2026-05-22 — Decisions logged in this file (section 10), not separate file
- 2026-05-22 — Hybrid inventory confirmed (per-product toggle: stock vs made-to-order)
- 2026-05-22 — Languages confirmed: Polish + English toggle
- 2026-05-22 — Tech stack locked (see section 4)
- 2026-05-22 — Guest checkout only at MVP
- 2026-05-22 — Moved from Claude.ai project to Claude Code in VS Code
- 2026-05-22 — One task per chat session, nuke after each — Del's usage efficiency rule
- 2026-05-22 — Project scaffold complete: client (React/Vite) + server (Node/Express) + Docker + root dev scripts
- 2026-05-22 — Deleted premature `ADMIN_GUIDE_EN/PL.md` and `TERMS_AND_CONDITIONS_TEMPLATE.md` (fiction, Phase 4 deliverables written too early)
- 2026-05-22 — Deferred DB schema in favour of mock UI first — see real UI needs, then schema writes itself from real requirements
- 2026-05-22 — Admin role split: Janetta = content only (upload products, set prices/descriptions); Del = technical (code, payments, bugs) — keeps admin UI dead simple
- 2026-05-22 — Admin panel MVP scope: Add product, Edit product, Hide/unpublish — nothing else
- 2026-05-22 — Image naming: server generates filename on upload (UUID/slug+timestamp), Janetta's phone filename discarded — zero friction
- 2026-05-22 — Image pipeline: always store raw original in Cloudinary, apply transformations at display time — upload code and schema never need rebuilding regardless of future bg removal decision
- 2026-05-22 — Background removal decision deferred — Joanna to decide if products need clean bg; parked in open questions
- 2026-05-22 — Cloudinary confirmed as image host (locked, dropping imgbb option)
- 2026-05-22 — Product detail page built (mock); react-router-dom added; routing live
- 2026-05-22 — Card image + name link to detail page; "Add to cart" button stays on card (separate interactables, a11y safe)
- 2026-05-22 — Pages in `client/src/pages/`, components stay in `client/src/components/`
- 2026-05-22 — Postal code stored and validated as free-text — no format enforcement, supports all countries (IE, PL, UK, US, etc.)
- 2026-05-22 — Mock checkout page built and UAT'd; Phase 2 mock UI complete
- 2026-05-22 — Turso account created (delpedro), DB named `jannettasapp`, region eu-west-1
- 2026-05-22 — DB schema applied: 4 tables (products, users, orders, order_items); schema.sql version controlled in server/db/
- 2026-05-22 — Auth token stored in 1Password + server/.env (gitignored); .env.example has placeholders only
- 2026-05-22 — Admin must be rebuilt as proper multi-section layout (tabs or child pages) before adding more features — current single-page dump is not good enough; "Add admin user" bolted to bottom of product list is wrong
- 2026-05-22 — Admin login page + dashboard stub live; JWT stored in localStorage; auth flow UAT confirmed
- 2026-05-22 — GET /api/products live; seed script populated Turso; frontend drops mock data
- 2026-05-22 — @libsql/client upgraded to latest (0.6.2 broke on Turso HTTP API); dotenv moved to client.js to fix ESM load order
- 2026-05-22 — @libsql/client installed; server/db/client.js wired up; server boots clean

---

## 11. BUGS

See `BUGS.md` (local, gitignored). Create it when the first bug hits — not before.

---

## 12. POST-REVEAL CHECKLIST

**Only action these when Janetta says yes. Do not open early.**

Append items here as they're identified. Format: `[ ] item — why it's needed`.

### Accounts & money
- [ ] Janetta creates her own Stripe account (business, Polish bank) — money must go to her, not Del's sandbox
- [ ] Swap Stripe test keys for live keys in Vercel: `STRIPE_SECRET_KEY` (sk_live_), `VITE_STRIPE_PUBLISHABLE_KEY` (pk_live_)
- [ ] Register live Stripe webhook in Janetta's Stripe dashboard → `https://janetta-app.vercel.app/api/webhooks/stripe`
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel with live webhook secret

### Email
- [ ] Buy/transfer domain — needed for Resend to send to any address (not just Resend account owner)
- [ ] Verify domain in Resend dashboard
- [ ] Update `FROM` address in `server/src/lib/email.js` from `onboarding@resend.dev` to `zamowienia@yourdomain.com` or similar
- [ ] Update `ADMIN_NOTIFICATION_EMAIL` in Vercel from Del's email to Janetta's email

### Admin
- [ ] Create Janetta's admin account via `/setup` or admin Users tab — do just before handover
- [ ] Send Janetta her temp password via WhatsApp (she must reset on first login)

### Comms
- [ ] Create WhatsApp Business group: Del + Joanna + Janetta — for order issues, support, coordination