# FixUP — Business Model

## 1. Model Summary

FixUP is a **subscription-based platform**, not a commission-based one. The platform does **not** take a percentage of each repair a technician completes. Instead:

- Every verified technician gets **5 free jobs** to experience the platform.
- After that, technicians choose a **monthly subscription plan** to keep receiving job access, visibility, and marketplace benefits.
- Technicians keep the full agreed repair income they negotiate with the consumer — FixUP's revenue comes from subscriptions and the parts marketplace, not from skimming repair earnings.

This is a deliberate contrast to commission-based gig platforms: it makes technician income predictable and keeps FixUP's revenue predictable too, decoupled from the friction of collecting a cut on every individual job.

## 2. Revenue Streams

| Stream | Mechanism |
|---|---|
| **Technician subscriptions** | Free 5-job trial → paid monthly tier for continued job access, priority matching, and full feature access |
| **Seller-side marketplace revenue** | Seller subscription plans, listing packages, and/or transaction/service fees on the parts & materials marketplace (structure optimized as the marketplace scales) |
| **B2B certification / trust-score licensing** (Phase 2) | License the aggregated repairability/trust-score data to retailers and manufacturers |
| **Corporate CSR / sponsorship** (Phase 2) | Companies sponsor city leaderboards or offset campaigns tied to their own ESG/CSR reporting |
| **Carbon-credit-style impact bundles** (Phase 3, stretch) | Companies purchase verified "e-waste avoided" impact bundles toward their own sustainability targets |

The platform explicitly does **not** rely on a per-job commission — that's the core differentiator from an Upwork-style take-rate model.

## 3. Technician Subscription Model

**Free trial:** 5 free jobs per verified technician on joining — enough to build initial reputation, get rated, and see the value of instant-match leads before paying anything.

**Paid tier unlocks:**
- Continued access to repair job opportunities
- Increased platform visibility and priority matching
- Technician reputation and rating profile
- Access to the materials and spare-parts marketplace
- Discount eligibility based on accumulated points
- Job and earnings management tools
- Repair history and digital portfolio
- Verification and trust badges
- Advanced features introduced in later platform stages

## 4. Points & Rewards System

Technicians earn points through platform activity:
- Completing verified repair jobs
- Maintaining high customer ratings
- Consistently completing jobs successfully
- Building a strong repair history
- Contributing to the repair ecosystem generally

**Points have real utility, not just a leaderboard number:** they unlock **discounts on spare parts and repair materials** purchased through the marketplace.

This creates a closed loop:

> More successful repairs → more points → better material discounts → lower repair costs → more competitive technicians → more repairs through the platform.

The **Impact Score** system (see §7) runs alongside and complements this — it rewards the same verified repairs but expresses the reward in environmental terms (e-waste avoided, CO₂ saved) rather than purely economic ones.

## 5. Materials & Spare-Parts Marketplace

FixUP operates a marketplace connecting **sellers** (shops, scrap dealers, salvage suppliers) with **technicians** and, where relevant, **consumers** directly.

- Sellers control their own listings: price, availability, inventory, and product condition (new / used / refurbished / salvaged).
- FixUP does **not** set the seller's base price — sellers manage their own economics.
- Technicians use the marketplace to source parts needed mid-repair rather than losing the job to a parts-sourcing dead end.
- Consumers can purchase relevant products directly when appropriate (e.g., a replacement part they want a technician to install, or a refurbished device).

**Points-based discounts:** technician earns points from verified repairs → selects a required part → seller's listed price is shown → eligible points are applied → technician gets a discounted price. This drives marketplace activity without FixUP taking a commission off the technician's repair income.

## 6. Seller Revenue Model

Sellers get a digital sales channel reaching a wider network of technicians and consumers than they'd otherwise access. They receive the full revenue from product sales at their own listed price. FixUP monetizes the seller side through subscriptions, listing packages, or service fees — never through a cut of the technician's repair earnings.

## 7. Impact Score — Gamified Environmental Impact

The Impact Score is the Forest-app-inspired layer that makes sustainability tangible for **both** sides of a repair transaction.

### 7.1 Mechanics
- Every completed & **verified** repair earns points to **both** the consumer (rewarded for choosing repair over replace) and the technician (rewarded for completing the job).
- Points convert into tracked impact metrics:
  - **E-waste saved (kg)** — estimated from a weight-by-category table (a fridge repair ≠ a phone repair)
  - **CO₂ emissions avoided** — estimated from avoided manufacturing/shipping of a would-be replacement
  - **"Trees saved" equivalent** — CO₂ translated into a relatable unit, same trick Forest uses
- **Leveling system:** cumulative points unlock levels/badges (e.g., "Repair Rookie" → "Fix Master" → "Circular Champion"), which double as a **trust signal** on technician profiles — tying gamification directly back into the reputation system rather than being a standalone gimmick.
- **Leaderboards:** city-wide or friend-based for consumers; for technicians, ranked by job volume **and** rating together, so the leaderboard rewards quality, not just speed.

### 7.2 Methodology honesty
Judges will ask "where do these numbers come from?" The defensible answer for a hackathon build: **peg estimates to published averages** (e.g., EPA / EU e-waste report figures for kg-CO₂-per-device-category) and state that openly as the methodology. No need to build a precise LCA model — just show the number isn't fabricated.

### 7.3 Why it strengthens the business model
- **New feature line:** Impact Gamification — points, levels, and environmental impact tracking for both consumers and technicians, driving repeat usage and technician retention.
- **New revenue angle:** Corporate CSR/sponsorship of leaderboards or offset campaigns (a bank or telco sponsoring "this city's Repair Champions" for their own ESG report) — an uncommon, genuinely good B2B story.
- **Phase-2 vision (don't over-promise):** carbon-credit-style bundles companies could buy toward their own CSR targets.
- **Innovation angle:** gamified environmental impact tied directly to a repair marketplace is an uncommon combination — most competing pitches won't have it.

## 8. Value Created Per Platform Party

| Platform party | Value received | Business relationship with FixUP |
|---|---|---|
| **Consumers** | Trusted technicians, transparent pricing, access to materials, live repair tracking, impact rewards | Pay for repair services and eligible marketplace purchases |
| **Technicians** | Job opportunities, portable reputation, materials marketplace, points-based discounts | 5 free initial jobs → monthly subscription |
| **Sellers** | Access to technicians and consumers via a shared marketplace | Sell at seller-determined prices; use paid marketplace services where applicable |
| **FixUP** | Recurring subscription revenue, marketplace ecosystem growth, network effects | Technician subscriptions + seller-side marketplace revenue + future platform services |

## 9. The Flywheel

```
More technicians join
        ↓
More repair capacity
        ↓
More customers use FixUP
        ↓
More repairs completed
        ↓
Technicians earn more points
        ↓
Better material discounts
        ↓
Sellers get more customers → more sellers join
        ↓
Wider parts availability
        ↓
More repairs become possible
        ↓
More customers choose repair over replacement
        ↓
(back to the top)
```

FixUP's growth compounds by **increasing ecosystem value**, not by taking a bigger cut of each transaction.

## 10. Target Market & Beachhead

- **Primary users:** urban/suburban households and small businesses with appliances, electronics, vehicles, or garments needing repair.
- **Supply side:** informal repair technicians currently reliant on word-of-mouth or a fixed shopfront.
- **Beachhead strategy:** launch hyperlocal — one city/suburb first — in one category first (electronics/appliances: highest e-waste impact, easiest to verify), then expand category and geography.
- **Global design intent:** verification requirements, currencies, payment methods, logistics, tax/regulatory rules, local certification systems, repair categories, and parts availability are all designed to be adaptable per market, while the core loop (verified technicians ↔ recurring jobs ↔ materials marketplace ↔ points/subscriptions) stays constant.

## 11. Why This Wins vs. Existing Options

- **Not a copy of Upwork** — instant-match beats open bidding for urgent, physical, time-sensitive repairs.
- **Not just a directory** — actively solves the parts-sourcing bottleneck that directory/listing apps never touch.
- **Trust is built into the core product**, not bolted on as a review widget — it's the verification pipeline, the portable reputation profile, and the points/subscription economics working together.

See `problem.md` for the problem this model is built to solve, and `plan.md` for how the hackathon prototype turns this model into a concrete, navigable mobile UI.
