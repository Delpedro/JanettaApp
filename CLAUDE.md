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
| Images | Cloudinary or imgbb (free tier) |
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

**Phase:** 2 — Mock storefront UI (building UI before DB to drive schema design).

**Where we are:**
- Scaffold done: `client/` (React 18 + Vite) + `server/` (Node + Express) both exist
- `npm run dev` from root starts both (client `:5173`, server `:3001`) via `concurrently`
- Vite proxies `/api/*` to server in dev
- Server has `/health` endpoint — confirmed working
- Docker + `docker-compose.yml` in place
- `.gitignore` covers `node_modules`, `.env`, `.claude/`, `BUGS.md`, `TDLR.md`
- `server/.env.example` exists — actual `.env` not created yet (Turso/Cloudinary creds not set up)
- Mock storefront homepage live at `:5173`: 3 product cards, PL/EN language toggle, warm craft-shop aesthetic
- Files: `client/src/data/mockProducts.js`, `client/src/components/Header.jsx`, `client/src/components/ProductCard.jsx`
- ~25 original files + new mock UI files staged and ready to commit — not pushed yet

**Next concrete action:** Review mock storefront, then decide what page to build next (product detail? cart? admin?). Schema follows UI, not the other way around.

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

---

## 10. DECISION LOG

Append every decision here. Newest at the top. Format: `YYYY-MM-DD — decision — short reason`.

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

---

## 11. BUGS

See `BUGS.md` (local, gitignored). Create it when the first bug hits — not before.