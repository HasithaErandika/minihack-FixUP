# FixUP — Software / Design Requirements Specification (Hackathon Prototype)

Companion documents: `problem.md` (why FixUP exists), `business_model.md` (how it makes money). This document specifies **what gets built** for the hackathon demo and **how it's designed**.

---

## 1. Purpose & Scope

Build a **polished, investor-ready mobile app prototype** for FixUP — a repair marketplace connecting consumers, technicians, and spare-parts sellers — that visually communicates measurable environmental impact alongside a professional, trustworthy marketplace experience.

**This is a UI/UX prototype, not a functional product.** The goal is to demonstrate the full experience convincingly inside a single browser tab, with realistic content, real interaction feedback, and no backend. Judges should be able to click through complete, coherent journeys for all three user types without hitting a dead end or a "not implemented" screen.

### 1.1 Hard constraints
- **HTML + CSS + vanilla JavaScript only.** No React/Vue/Angular/Flutter, no build step, no external UI framework. (A tasteful, minimal use of a CDN icon font or a single web font is acceptable; everything else is hand-built.)
- **Single centered mobile-screen mockup** on the page — a realistic phone frame is the fixed template. All screens, nav, cards, modals, dashboards, forms, profiles, and interactions render **inside** that fixed viewport. No separate desktop pages.
- The surrounding webpage (outside the phone frame) is a clean presentation backdrop — not a second layout to design content for.
- Fully **client-side**: all "data" (jobs, technicians, listings, messages, impact stats) is mock data defined in JS, seeded at load, mutated in memory (and optionally persisted to `localStorage` so state survives a refresh during a demo).

### 1.2 Design north star
Forest's *satisfying, honest feedback loop* (every animation is proof an action mattered) fused with Upwork's *structured, credible professionalism* (cards, ratings, budgets, proposals, portfolios) — expressed through FixUP's own visual identity, not a skin on either product.

---

## 2. Design System

### 2.1 Color palette

**Primary**
| Token | Hex | RGB | Primary use |
|---|---|---|---|
| `--color-deep-blue` | `#3368A0` | 51,104,160 | Primary actions, active nav, key headings, links |
| `--color-mid-blue` | `#66A3BF` | 102,163,191 | Secondary actions, progress states, sustainability accents |
| `--color-sage` | `#C8DFDB` | 200,223,219 | Success/impact surfaces, progress fills, subtle highlight backgrounds |
| `--color-cream` | `#F2EFE7` | 242,239,231 | App background, card backgrounds, warm balance |

**Secondary**
| Token | Hex | RGB | Primary use |
|---|---|---|---|
| `--color-indigo` | `#293681` | 41,54,129 | High-emphasis text on light surfaces, critical CTAs, badges |
| `--color-royal` | `#4274D9` | 66,116,217 | Interactive highlights, links-on-dark, chart accents |
| `--color-sky` | `#95CCDD` | 149,204,221 | Chips, tags, informational surfaces |
| `--color-mint` | `#D0E7E6` | 208,231,230 | Impact/eco badges, level-up surfaces, subtle dividers |

**Usage rules**
- Deep blues (`--color-deep-blue`, `--color-indigo`) → primary buttons, bottom-nav active state, headers that carry authority (job confirm, payment, verification).
- Mid blues / blue-greens (`--color-mid-blue`, `--color-sage`, `--color-mint`) → progress bars, impact stat cards, streak indicators, success states.
- Cream (`--color-cream`) → base app background; white or near-white only for elevated card surfaces if extra separation is needed.
- No decorative gradients beyond one subtle brand gradient (deep-blue → royal) reserved for the onboarding hero and the level-up celebration — never on ordinary buttons or cards.
- Functional colors kept minimal and desaturated to match the palette: success = sage/mint family, warning = a muted amber (used sparingly, not part of the core palette so it stays rare and meaningful), error = a muted brick red — both only for system states, never decorative.

### 2.2 Typography
- One typeface family, e.g. **Inter** (system-ui fallback stack: `-apple-system, "Segoe UI", Roboto, Inter, sans-serif`) — keeps the "no external framework" spirit while allowing a single Google Font `<link>` if desired.
- Scale (mobile-first): Display 28/34, H1 22/28, H2 18/24, Body 15/22, Small 13/18, Micro 11/14.
- Weights: 700 for headings/emphasis, 600 for buttons/labels, 400 for body.
- Numerals in impact stats and counters use tabular figures so count-up animations don't jitter in width.

### 2.3 Spacing & radii
- 4px base unit; spacing scale 4/8/12/16/24/32/40.
- Card radius 16–20px, button radius 12px (pill radius 999px for chips/tags/status badges), input radius 12px.
- Consistent card padding (16px) and inter-card gap (12px) across every list/grid screen.

### 2.4 Elevation
- Two shadow levels only: **resting** (soft, 0/2/8, low opacity) and **raised** (0/8/24, used for modals/sheets/floating action button). No harsh drop shadows, no neumorphism.

### 2.5 Core components (reused everywhere, defined once in CSS)
- **Phone frame**: fixed-aspect device chrome (notch, side buttons, home indicator), centered on page, subtle ambient shadow, page backdrop in a muted neutral so the device pops.
- **App shell**: status bar (time/battery, decorative) → screen content (scrollable) → bottom tab bar (role-dependent) → optional floating action button.
- **Bottom navigation**: 4–5 tabs, icon + label, active tab in deep blue with a small indicator; tab set swaps per role (see §3).
- **Top app bar**: back button / screen title / contextual action (search, filter, notifications bell with badge).
- **Cards**: job card, technician card, listing/part card, message preview card, notification card, badge/achievement card — all share the same base card component with slot-based content.
- **Buttons**: primary (filled deep blue), secondary (outline/mid-blue), ghost/text, icon button, floating action button. Consistent pressed/disabled/loading states (spinner replaces label, button width locked to prevent layout shift).
- **Inputs**: text field, textarea, select/dropdown sheet, search bar with clear button, stepper, toggle, radio/checkbox groups, photo-upload tile grid, chip-select (for skills/categories).
- **Chips & badges**: status chip (Open/In progress/Completed/Cancelled), category chip, trust/verification badge, level badge, streak flame badge.
- **Avatars**: circular, with a colored ring for verified users and a small camera/repair icon variant for technicians.
- **Progress elements**: linear progress bar (impact level, job status stepper), circular progress ring (impact score dial on dashboard), horizontal stepper (job lifecycle: Requested → Matched → Confirmed → In Progress → Completed).
- **Modals / bottom sheets**: confirmation sheet, filter sheet, quote-review sheet, rating sheet — slide up from bottom, dim overlay, swipe-down-to-dismiss affordance.
- **Toasts**: transient bottom toast for lightweight confirmations ("Message sent", "Badge unlocked").
- **Empty / loading / success states**: every list-type screen has all three designed — never just left blank. Loading uses skeleton cards (shimmer), not spinners, for content lists.

### 2.6 Iconography & illustration
- Single consistent icon set (inline SVG, stroke-based, 1.5–2px stroke, rounded caps) — hand-authored or one open-license icon set, not mixed styles.
- A small set of original, simple environmental/repair line illustrations (a device with a repair wrench, a leaf, a recycling loop, a growing plant) reused across onboarding, empty states, and the impact dashboard — flat, on-brand color, not stock-photo or generic-AI aesthetic.

### 2.7 Motion (see §6 for the full Impact Score animation spec)
- Standard transition: 200–300ms ease-out for screen-to-screen navigation (slide-in-from-right for "push," slide-up for sheets/modals).
- Micro-interactions (button press, chip select, tab switch) at 100–150ms.
- All non-essential motion wrapped so it's skipped under `prefers-reduced-motion: reduce`.

---

## 3. Information Architecture — Three Roles, One Shell

The prototype demonstrates **all three sides of the marketplace** inside the same phone frame. A **role switcher** (a small control on the onboarding/login screen, and a shortcut in Settings) lets a judge jump between Consumer, Technician, and Seller views without leaving the mockup — this is the single most important navigation affordance for a hackathon demo, since it lets one presenter show three entire user types in one flow.

Each role has its own bottom-tab set and home screen, but they **share the same design system, components, and several cross-cutting screens** (profile shell, notifications, messaging, settings) so the product feels like one coherent app, not three prototypes stapled together.

| Role | Bottom tabs |
|---|---|
| **Consumer** | Home · Discover (browse technicians/categories) · Post Repair (FAB) · Impact · Profile |
| **Technician** | Jobs · Parts Marketplace · Earnings · Impact · Profile |
| **Seller** | Listings · Orders · Marketplace Insights · Profile |

Messaging and Notifications are reached via the top app bar (icon buttons with badges) from any Home-level screen, in all three roles.

---

## 4. Screen Inventory

Screens marked **[Shared]** use one implementation across roles with role-aware content. Screens marked **[C]/[T]/[S]** are role-specific.

### 4.1 Onboarding & Auth [Shared]
1. **Splash** — logo mark, brand tagline, ambient background motion.
2. **Onboarding carousel** (3 slides) — storytelling: "Repair, not replace" / "Verified technicians you can trust" / "Every fix has an impact" — each with a simple original illustration.
3. **Role selection** — "I need something repaired" / "I'm a technician" / "I sell parts & materials" (doubles as the demo role switcher).
4. **Sign up / Log in** — simple form (name, email/phone, password) + social-style buttons (decorative only). Technician path adds a short "you'll verify your identity after signup" notice.
5. **Technician verification flow [T]** — multi-step: ID upload tile → category selection (chip-select) → skill assessment (a short mock quiz screen) → reference/VTA certificate upload → "Under review" success state with expected timeline.

### 4.2 Home / Dashboard [Shared, role-aware]
6. **Home [C]** — greeting header, impact snapshot card (mini ring + streak), "Post a repair" primary CTA, personalized technician/category recommendations carousel, recent activity.
7. **Home / Job Feed [T]** — instant-accept job cards (item, category, budget, distance, time posted), quick filters (category chips), earnings-this-week strip.
8. **Home / Listings [S]** — inventory summary strip (active listings, low stock alerts), quick-add listing FAB, recent orders preview.

### 4.3 Sustainability / Impact
9. **Impact overview [Shared]** — large impact ring (points → level progress), stat grid (e-waste avoided kg, CO₂ avoided kg, trees-equivalent, money saved for consumers / earned for technicians), streak calendar, milestone timeline.
10. **Achievements / Badges [Shared]** — grid of earned + locked badges, tap for badge detail sheet (how it was earned, rarity).
11. **Leaderboard [Shared]** — city-wide or friends tab (consumer), job-volume-and-rating tab (technician); current user's row pinned/highlighted.
12. **Level-up celebration [Shared, modal]** — full-screen celebratory overlay triggered from repair completion (see §6.3).

### 4.4 Discovery & Search
13. **Discover [C]** — category grid (Electronics, Appliances, Vehicles, Garments, Other), featured technicians, "Sustainability Spotlight" curated section.
14. **Search & filter [Shared]** — search bar + filter bottom-sheet (category, distance, price range, rating, availability; for parts: condition, price, seller rating).
15. **Technician profile / portfolio [C→T view]** — avatar, verification + level badges, rating summary, skills chips, portfolio gallery (before/after repair photos), reviews list, "Request quote" CTA.
16. **Parts marketplace browse [T]** — searchable/filterable part listing grid, "Request this part" flow.
17. **Part / listing detail [Shared]** — photos, price, condition, seller card, stock, "Add to request" / "Buy" CTA.

### 4.5 Job / Project Lifecycle
18. **Post a repair request [C]** — multi-step form: item category → photos (upload tile grid) → description → location (map placeholder or address field) → preferred time → review & submit.
19. **Instant match results [C]** — 3 ranked technician cards (rating, distance, price estimate) with a short "why matched" line; select one to proceed.
20. **Quote review & confirm [C]** — fixed price breakdown, estimated time, technician summary, confirm button → success state.
21. **Job tracking [C]** — horizontal status stepper (Requested → Matched → Confirmed → In Progress → Parts Sourcing [conditional] → Completed), live-feel status card, technician contact shortcut.
22. **Job detail / management [T]** — accept/decline (pre-accept only), status updater, "request part" shortcut into Parts Marketplace, mark-complete action.
23. **Rating & review [C]** — star rating, tag chips ("On time," "Fair price," "Great work"), comment field → triggers the repair-completed Impact Score sequence (§6.1).
24. **Post a listing [S]** — multi-step form: category → photos → condition → price → quantity/stock → publish.
25. **Create/browse projects (Upwork-style board)** — optional richer job-board view: project cards with budget, skills required, proposal count; **[C]** create-project flow (post a bigger/multi-part sustainability job); **[T]** browse + **submit proposal** flow (cover note, price, timeline).
26. **Proposals inbox [T]** — list of submitted proposals with status (Pending/Accepted/Declined).
27. **Proposals received [C]** — list of technician proposals on a posted project, compare side-by-side, accept one.

### 4.6 Money
28. **Checkout / payment [C]** — order/quote summary, mock payment method selector, pay button, receipt success state.
29. **Earnings dashboard [T]** — total earned, this-week chart (simple bar/line drawn with SVG or canvas), payout history list, subscription status card.
30. **Subscription plans [T]** — free-trial-remaining indicator ("3 of 5 free jobs left"), plan comparison cards, upgrade CTA.
31. **Points & discounts [T]** — points balance, "apply points" flow inside a part purchase, redemption history.
32. **Orders [S]** — incoming order list with status, order detail (buyer, item, quantity, fulfillment action).
33. **Marketplace insights [S]** — simple sales chart, top-selling parts, revenue summary, seller subscription/plan card.

### 4.7 Communication
34. **Notifications [Shared]** — grouped by Today/Earlier, icon-coded by type (job update, message, badge, payment, system), unread indicator.
35. **Messaging — thread list [Shared]** — conversation previews with avatar, last message, unread badge, timestamp.
36. **Messaging — chat [Shared]** — bubble thread, quick-reply chips for common repair-flow messages, attachment button (photo), tied to a specific job/order context (shows a small job-context card pinned at top).

### 4.8 Profile & Settings [Shared, role-aware content]
37. **Profile (own)** — avatar, name, role badge, verification badge (technician), rating summary, impact snapshot, tabs: About / Reviews / Portfolio (tech) or Activity (consumer) / Listings (seller).
38. **Edit profile** — form for avatar, bio, skills/categories, location.
39. **Saved items [C]** — saved technicians and saved parts/listings, tabbed.
40. **Settings** — account, notifications toggle, privacy, payment methods, linked WhatsApp bot toggle, language/region (nod to the "global marketplace" strategy), reduced-motion toggle, log out.
41. **Help / support** — FAQ accordion, contact support entry point.

### 4.9 System states (designed once, reused everywhere)
- **Empty states** — illustrated, with a clear primary action (e.g., empty job feed → "No jobs match your filters yet").
- **Loading states** — skeleton-card shimmer for lists, spinner only for full-screen transitions/button loading.
- **Error / offline state** — simple retry card, on-brand illustration, never a raw browser error look.
- **Success states** — checkmark + short affirming copy, used after submit-type actions (post request, submit proposal, publish listing, complete payment).

---

## 5. User Journeys

### 5.1 Consumer journey
| Step | Screen(s) | What happens |
|---|---|---|
| 1. Post repair request | Post a repair request (18) | Item type, photos, location submitted |
| 2. Instant match | Instant match results (19) | 3 nearby verified technicians ranked by rating/distance/price |
| 3. Compare & confirm | Technician profile (15), Quote review (20) | Reviews profiles, locks a fixed transparent quote |
| 4. Track & repair | Job tracking (21), Chat (36) | Live status stepper, incl. parts sourced via pooling network |
| 5. Rate technician | Rating & review (23) | Confirms completion, rates — feeds the trust score |
| 6. Earn impact points | Repair-completed sequence (§6.1) → Impact overview (9) | Points → e-waste avoided, CO₂ saved, level progress |

### 5.2 Technician journey
| Step | Screen(s) | What happens |
|---|---|---|
| 1. Get verified | Verification flow (5) | ID + skill assessment + reference/VTA check |
| 2. Accept job | Job Feed (7), Job detail (22) | Instant-accept feed, no bidding |
| 3. Source parts | Parts marketplace browse (16), Part detail (17) | Searches/requests a part through the pooling network |
| 4. Complete repair | Job detail (22) → consumer confirms in (23) | Marks complete; consumer confirmation triggers payment release |
| 5. Get paid | Earnings dashboard (29) | Payment reflected, subscription/free-jobs-remaining status visible |
| 6. Earn impact points | Repair-completed sequence (§6.1) → Impact overview (9) | Points build trust tier, leaderboard position, platform visibility |

### 5.3 Seller journey
| Step | Screen(s) | What happens |
|---|---|---|
| 1. List inventory | Post a listing (24) | Category, photos, condition, price, stock published |
| 2. Get discovered | Parts marketplace browse (16, as seen by technicians/consumers) | Listing appears in technician/consumer search & filter |
| 3. Receive request/order | Orders (32) | Technician requests a part or a consumer buys directly |
| 4. Fulfill order | Order detail (within 32) | Updates fulfillment status |
| 5. Get paid | Marketplace insights (33) | Revenue reflected at seller-set price; platform revenue comes from seller subscription/listing plan, not a cut of this sale |
| 6. Grow presence | Marketplace insights (33), seller Profile (37) | Sales chart, top-selling parts, reputation as a reliable parts source |

---

## 6. Impact Score — Interaction & Animation Spec

Every animation here exists to **prove an action mattered**, never as decoration. This is what makes the sustainability layer feel like Forest rather than a generic progress bar.

### 6.1 Trigger moment — "Repair completed"
Sequence on the rating/completion success screen:
1. Checkmark pulses in — **150ms**.
2. Points counter ticks up from old → new value — **600–800ms**, ease-out (decelerates like it's "landing"). Use tabular-number CSS so digits don't jitter width.
3. A small `+180 pts` chip flies upward and fades — **400ms**.

This is the single most important animation in the whole prototype — build and polish it first.

### 6.2 Progress bar fill
- Bar fills old → new position over **~800ms**, eased (fast start, settle at the end — like water leveling).
- If the fill crosses a level boundary: pause briefly at 100%, then hand off directly into the level-up celebration (§6.3) rather than just continuing past it.

### 6.3 Level-up celebration
Reserved as the most elaborate animation in the app — used sparingly, only on an actual level-up:
1. Screen briefly dims/focuses (spotlight effect).
2. Level badge scales in from 0 with slight overshoot (spring easing, **~500ms**).
3. New level name fades in below it.
4. Short particle/confetti burst in the mint/sky palette — **1–1.5s**, skipped entirely under `prefers-reduced-motion`.
5. Progress bar resets to 0% for the new level with a quick "snap."
- **Total budget: under 2 seconds.** Must be tap-through-dismissible at any point — never block the user from continuing.

### 6.4 Badge unlock
Smaller than a level-up: badge icon flips in (`rotateY`, **300ms**) or scales in with a soft bounce, plus a brief toast ("First fix unlocked").

### 6.5 Impact stat counters
Same count-up mechanic as points but slower and quieter — **1000ms**, no chip, no accompanying sound/haptic cue. These numbers (e-waste kg, CO₂ kg, trees) should feel steady and cumulative, not game-y like the points counter.

### 6.6 Ambient / idle state
On the Impact overview screen, the level icon (e.g., a growing plant/patina motif) has a slow looping micro-animation — **3–4px drift, 3s loop** — so the screen feels alive even at rest. Respect `prefers-reduced-motion`.

### 6.7 Implementation notes (vanilla JS, no framework)
- Count-up: a small reusable `animateCount(el, from, to, duration, {easing})` helper using `requestAnimationFrame`; reused for points, e-waste, CO₂, trees, and earnings figures.
- Progress fill: animate a `width`/`transform: scaleX()` on a bar's inner element via a CSS transition triggered by toggling a class, so the browser compositor handles it (no JS-driven per-frame width changes).
- Level-up particles: a lightweight canvas or absolutely-positioned divs burst — capped particle count (≈20–30) since this is a UI demo, not a game engine.
- Every decorative animation is gated behind a single check against `window.matchMedia('(prefers-reduced-motion: reduce)')`, applied once at a shared "can-animate" flag rather than re-checked ad hoc.
- Nothing above 1.5s except the level-up (capped at 2s) — anything longer reads as laggy live, in front of judges.

### 6.8 Impact estimate methodology (for the pitch)
Every displayed e-waste/CO₂ figure is derived from a small static lookup table (`impactFactors.js`): kg-of-e-waste-avoided and kg-CO₂-avoided per device category, sourced from published EPA/EU e-waste report averages. This is stated explicitly in-app (a small "How we calculate this" info link on the Impact overview screen) so the numbers read as principled estimates, not invented ones.

---

## 7. Mock Data Model (JS, in-memory)

No backend; a `data/` module seeds a small realistic dataset on load and the app mutates it client-side (optionally mirrored to `localStorage` so a refresh mid-demo doesn't lose state).

- **User** — id, name, avatar, role (`consumer` | `technician` | `seller`), location, joinedDate, impact { points, level, streakDays, ewasteKg, co2Kg, treesEquivalent, moneySaved }, savedItems[].
- **Technician** (extends User) — verification { idVerified, skillAssessed, referenceChecked, vtaCertified }, categories[], rating, reviewCount, portfolio[], subscription { status, freeJobsRemaining }, earnings { total, thisWeek, history[] }.
- **Seller** (extends User) — businessName, listings[], orders[], salesSummary.
- **Job/RepairRequest** — id, consumerId, technicianId, category, itemDescription, photos[], location, status (stepper stage), quote { amount, breakdown }, createdAt, timeline[] (status change log for the tracker), partsUsed[].
- **Project** (Upwork-style, optional richer flow) — id, consumerId, title, description, budget, skillsRequired[], proposals[].
- **Proposal** — id, projectId/jobId, technicianId, coverNote, price, timeline, status.
- **Listing/Part** — id, sellerId, title, category, condition, price, stock, photos[], compatibleWith[].
- **Order** — id, listingId, buyerId (technician or consumer), quantity, status, pointsApplied.
- **Message/Conversation** — id, participantIds[], jobContextId, messages[] { senderId, text, timestamp, attachment }.
- **Notification** — id, userId, type, text, relatedId, read, timestamp.
- **Badge/Achievement** — id, name, description, icon, rarity, unlockedCondition.
- **impactFactors** — static lookup: category → { ewasteKgAvoided, co2KgAvoided }.

---

## 8. Architecture & File Structure

Vanilla, no build tooling — open `index.html` directly or serve statically.

```
/index.html                 -- phone frame shell + all screen templates or screen mount point
/css/
  tokens.css                -- CSS custom properties: colors, spacing, radii, shadows, type scale
  base.css                  -- reset, typography, phone-frame chrome
  components.css            -- buttons, cards, chips, inputs, nav, modals, toasts (BEM-ish naming)
  screens.css                -- per-screen layout rules, organized by section matching §4
  animations.css             -- keyframes + transition classes for §6
/js/
  app.js                     -- boot, role/state init, router mount
  router.js                  -- lightweight hash- or state-based screen router (push/pop, transition class toggling)
  state.js                   -- in-memory app state + localStorage sync
  data/
    seed.js                  -- mock users, jobs, listings, messages, notifications
    impactFactors.js          -- category → e-waste/CO2 lookup table
  components/
    card.js, modal.js, toast.js, stepper.js, counter.js, chip.js  -- small reusable render/behavior helpers
  screens/
    onboarding.js, home.js, discover.js, jobTracking.js, impact.js,
    marketplace.js, messaging.js, profile.js, settings.js, ...    -- one module per screen group from §4
  impactAnimations.js        -- animateCount, level-up sequence, badge unlock (per §6.7)
/assets/
  icons/                     -- inline SVG icon set
  illustrations/             -- onboarding + empty-state illustrations
```

**Routing approach:** a minimal in-memory router — `navigateTo(screenId, params)` swaps the mounted screen's DOM inside the phone frame's content area, toggles a slide transition class, and pushes to a small history stack so an in-frame back button/gesture works. No real URL routing needed (a single hash prefix is optional, only if deep-linking a specific screen during the demo is useful).

**State management approach:** one central `state` object + a tiny pub/sub (`subscribe(key, callback)`) so screens re-render on relevant state changes (e.g., the bottom-nav badge count updates when a notification is read) without a framework — deliberately minimal, not a Redux clone.

---

## 9. Non-Functional Requirements

- **Performance:** first paint of the phone frame near-instant (all assets local/inlined SVG where reasonable); screen transitions must stay smooth at 60fps — favor CSS transitions/transforms over JS-driven layout changes.
- **Accessibility:** color contrast meets WCAG AA against the cream/blue palette (verify deep-blue-on-cream and text-on-sage combinations specifically); every interactive element reachable and operable via keyboard for judge review; `prefers-reduced-motion` respected everywhere in §6; form inputs properly labeled.
- **Responsiveness (within the frame):** the phone mockup itself has a realistic fixed smartphone aspect ratio and stays centered with clean surrounding space at any reasonable browser window size; content inside reflows correctly at the mockup's own internal width, it does not need to support arbitrary viewport widths since it's a fixed device frame, not a responsive page.
- **Consistency:** every screen pulls from the same token/component set defined in §2 — no one-off colors, radii, or button styles introduced per-screen.
- **Demo resilience:** all flows must be completable with mock data only, no dead links, no console errors during the golden-path click-through; state resets cleanly (a "Reset demo" action in Settings) so it can be re-run for multiple judges.

## 10. Explicitly Out of Scope

- Real authentication, real payments, real backend/API, real geolocation/maps (use a static map illustration or placeholder), real push notifications, real WhatsApp bot integration (represented as a settings toggle / mention only, per the business plan's low-friction access channel), multi-language content (structure allows for it per §4.8, but only one locale is written).

---

## 11. Build Plan (Hackathon Milestones)

1. **Foundation** — tokens.css, base.css, phone-frame chrome, router skeleton, seed data.
2. **Core component library** — buttons, cards, chips, nav, inputs, modals/sheets, toasts, skeleton loaders.
3. **Onboarding → role selection → Home (all 3 roles)** — get the role-switch demo path working end to end early; it's the backbone of the presentation.
4. **Consumer golden path** — Post request → Instant match → Quote → Track → Rate → Impact Score sequence (§6.1–6.3). This is the single most important journey to nail.
5. **Technician golden path** — Verification → Job feed → Job detail → Parts marketplace → Complete → Earnings → Impact.
6. **Seller golden path** — Post listing → Orders → Marketplace insights.
7. **Cross-cutting screens** — Messaging, Notifications, Profile, Settings, Search/filter.
8. **Impact system polish** — achievements, leaderboard, streak calendar, count-up/level-up animation refinement, "How we calculate this" methodology note.
9. **Empty/loading/error states pass** — go back through every list screen and design all three states.
10. **Final polish pass** — spacing/contrast audit against §2 and §9, reduced-motion audit, demo-reset action, remove any placeholder/lorem content in favor of realistic copy.

Steps 3–6 form the critical path for a working demo; steps 7–10 are what push it from "working" to "hackathon-winning."
