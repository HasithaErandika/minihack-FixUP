# FixUP — Problem Statement

## 1. Overview

FixUP targets a single, concrete failure in how repair happens today: **it is easier to throw something away and buy new than it is to get it fixed.** That failure is not one problem — it's three linked problems, each reinforcing the others, and each responsible for a piece of the growing e-waste crisis.

## 2. The Three Linked Problems

### 2.1 Consumers can't find trustworthy repair
When something breaks — a phone, a fridge, a laptop, a piece of clothing — the consumer has no reliable way to answer three basic questions:
- **Who** can actually fix this, nearby, right now?
- **Can I trust them** with my device, my home, my money?
- **What will it actually cost**, before I commit?

Without answers, the path of least resistance is replacement. Repairable goods get discarded not because they *can't* be fixed, but because finding out *if* and *how* costs more effort than most people are willing to spend. There is no visibility, no quality guarantee, and no price transparency in the informal repair market.

### 2.2 Technicians stay invisible and underpaid
Skilled repair technicians — electronics, appliance, vehicle, garment specialists — largely operate through word-of-mouth or a fixed shopfront. This means:
- No way to build a portable, verifiable reputation.
- No consistent lead flow — income is lumpy and location-bound.
- No mechanism to scale beyond the neighborhood they happen to work in.

A technician's skill is real, but it's economically invisible outside their existing network. The market has no trust layer that lets a stranger's five years of good repairs count for anything with a new customer.

### 2.3 Spare parts are hard to source
Even when a consumer finds a technician and the technician is willing to take the job, the repair can still fail — not because of skill, but logistics. Technicians routinely lose time and money hunting for the right part across multiple shops, scrap dealers, and suppliers. A repair that was otherwise completely feasible dies at the parts-sourcing stage. There is no shared inventory visibility across the informal parts supply chain.

## 3. What Happens If This Stays Unsolved

- **E-waste keeps growing.** Repairable devices are discarded by default, not by necessity.
- **Sri Lanka's import-dependent economy stays exposed to forex shocks.** Every unnecessary replacement purchase is an avoidable import.
- **A skilled workforce stays economically invisible.** Technicians who could be earning steady, fairly-priced work remain trapped in low-visibility, low-leverage word-of-mouth cycles.

## 4. Why Existing Options Don't Solve It

| Existing option | Why it falls short |
|---|---|
| Buying new | Fast and "safe," but environmentally and economically wasteful when repair was viable |
| Repair-shop directory / listing sites | Solves *discovery* only — no trust/verification layer, no price transparency, no parts-sourcing help |
| Open-bidding freelance marketplaces (Upwork-style) | Built for asynchronous knowledge work, not urgent physical repairs — open bidding is too slow and too uncertain when someone needs their fridge fixed today |
| Word-of-mouth technician networks | Works, but doesn't scale, doesn't verify, and doesn't travel outside the existing social graph |

None of these directly tackle the **parts-sourcing bottleneck**, and none build **trust into the core product** rather than bolting it on as a review widget.

## 5. The Three Platform Parties

FixUp is a three-sided marketplace. Each party has a distinct core need:

| Party | Who they are | Core need |
|---|---|---|
| **Consumers** | Households and small businesses with something broken — electronics, appliances, vehicles, garments, machinery | Trust and convenience: knowing who they're letting near their property, at a fair and transparent price |
| **Technicians / Repairmen** | Skilled individuals or small repair shops, currently reliant on word-of-mouth or a fixed shopfront | Steady, fairly-priced work and a portable reputation not tied to one shopfront |
| **Spare Parts & Materials Sellers** | Shops, scrap dealers, salvage suppliers with surplus, salvaged, or new inventory | A channel to move inventory that would otherwise sit unsold or go to waste, turned into recurring revenue |

## 6. Problem-to-Solution Mapping

| Problem | FixUp mechanism that addresses it |
|---|---|
| No visibility into trustworthy technicians | Verification onboarding (ID + skill test + reference/VTA check) + reputation profile + rating-driven trust score |
| No price transparency | Fixed, transparent quote shown before the consumer confirms — no bidding war, no surprise costs |
| Technicians invisible / underpaid | Instant-match job feed, portable reputation profile, earnings dashboard, leaderboard visibility |
| Spare parts hard to source | Shared spare-parts pooling network searchable by technicians, tied into the marketplace |
| No incentive to choose repair over replacement | Gamified Impact Score system (points, levels, badges) translating each repair into e-waste avoided, CO₂ saved, and a relatable "trees saved" metric |

This document defines the *why*. See `business_model.md` for the *how it makes money*, and `plan.md` for the *how it's built* (the hackathon UI prototype's full design and information architecture).
