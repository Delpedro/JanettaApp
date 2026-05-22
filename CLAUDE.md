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
- `BUGS.md` exists (local, gitignored) — BUG-001 logged: mock product images cross-assigned
- **Turso DB live:** `jannettasapp` on `aws-eu-west-1`. 4 tables applied: `products`, `users`, `orders`, `order_items`
- **DB schema:** `server/db/schema.sql` (version controlled)
- **DB client:** `server/db/client.js` — `@libsql/client` (latest) wired, reads from `.env`, dotenv loaded here to fix ESM import-order issue
- **`GET /api/products`** — live, queries Turso, returns only published products, normalises to camelCase. UAT confirmed.
- **`GET /api/products/:id`** — live, returns single product or 404.
- **Seed:** `server/db/seed.js` — run once, idempotent, populated DB with 6 mock products. Real product photos now in `client/public/images/` (product1–6.JPEG). UAT confirmed — all 6 load. Cloudinary later.
- `HomePage` and `ProductDetailPage` fetch from API — mock import removed.
- **`POST /api/orders`** — live. Accepts guest checkout payload, writes to `orders` + `order_items`, decrements stock for stock-tracked products. UAT confirmed — order landed in Turso.
- `CheckoutPage` now POSTs to real API. Loading state, server error handling, bilingual error strings.

**Next concrete action:** Admin auth — `POST /api/auth/login` + JWT middleware.

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

---

## 10. DECISION LOG

Append every decision here. Newest at the top. Format: `YYYY-MM-DD — decision — short reason`.

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
- 2026-05-22 — GET /api/products live; seed script populated Turso; frontend drops mock data
- 2026-05-22 — @libsql/client upgraded to latest (0.6.2 broke on Turso HTTP API); dotenv moved to client.js to fix ESM load order
- 2026-05-22 — @libsql/client installed; server/db/client.js wired up; server boots clean

---

## 11. BUGS

See `BUGS.md` (local, gitignored). Create it when the first bug hits — not before.