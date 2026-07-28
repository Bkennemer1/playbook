# PLAYBOOK-STATE.md

Living state doc for the Guarantee Mortgage Playbook. Read this first in any new session.
Last updated: end of build session, July 2026.

---

## What this project is

`playbook.guaranteemc.com` — a public (no-auth) Next.js 15 + MDX site documenting the full life of a loan at Guarantee Mortgage, application through post-close. It's a training/reference site for the team AND a process audit: it documents how things actually work today, including the gaps, not an idealized version.

- **Repo:** `Bkennemer1/playbook` (GitHub)
- **Hosting:** Vercel, auto-deploys from `master`
- **Local clone:** `C:\Users\18329\Downloads\playbook\playbook` (note: in Downloads; consider moving to `C:\Users\18329\Code\playbook`)
- **Content:** `content/phases/[phase-slug]/[step-slug].mdx`
- **Structure source of truth:** `lib/phases.ts`
- **Standalone reference pages:** `content/reference/` + a matching route under `app/reference/`

## How edits get made

Planning happens in Claude.ai (this project). Execution happens via **CC cloud** prompts: Claude writes the MDX + a CC prompt, Bryce pastes the prompt into Claude Code cloud on the `playbook` repo, CC creates files / edits `lib/phases.ts` / runs `npm run build` / commits / pushes. Vercel auto-deploys ~60s later.

**Hard-won build lessons:**
- MDX rendering requires `mdx-components.tsx` at repo root (the `useMDXComponents` pass-through). Without it every page silently renders the "Content coming soon" placeholder. This is fixed — don't remove it.
- Dynamic route params are Next.js 15 style (Promise, awaited) in `app/phases/[phase]/[step]/page.tsx`. Do NOT use `fs.existsSync` to gate MDX imports — import directly in try/catch.
- Every CC prompt should include a build-output verification step (grep the built HTML for a known phrase) before committing — this caught the placeholder bug.
- Closing `</div>` tags glued to paragraph text break the MDX build. Each closing tag on its own line.

## Status

**All 9 phases drafted and live at `draft` status.** ~20 step pages.

- Phase 1 — Application & Pre-Approval (5 steps): lead-intake-qualifying, take-application, pull-credit, run-aus, issue-preapproval
- Phase 2 — Document Intake (2): generate-needs-list, borrower-portal-upload
- Phase 3 — Disclosures (1): send-disclosures
- Phase 4 — Handoff (2): submit-handoff-form, pre-underwriting-review
- Phase 5 — Processing (2): file-setup, uw-prep-and-submission
- Phase 6 — UW Decision / AWC (3): awc-trigger, borrower-conditions, docs-and-arive-conditions
- Phase 7 — Clear to Close (1): ctc-issued
- Phase 8 — Closing (4): review-ctc, cd-issued, balance-and-final-cd, signing-through-funded
- Phase 9 — Post-Close (1): post-close-followup
- Reference — Borrower Email Automations (`/reference/borrower-emails`): seeded with the Loan Setup email only

**Team & lanes (permanent, architectural):**
- Bryce Kennemer — LO / branch manager (builder). Dean Kennemer — Admin/LO.
- Hunter Thomas — LOA / Loan Concierge. ALL borrower-facing work. Runs Pre-W.
- Danielle Richardson — Processor (active). ALL back-office. Never contacts borrower.
- Emily Kennemer — Closer. UWM files only (UClose). CTC → funded.
- Beta LOs: Jordan Guggenheim, Royce Horn, Jerod Rosenbarker.

---

## NEXT ACTIONS (in priority order)

### 1. Review pass → flip draft to live
Read all 9 phases on the live site as a new hire would. Catch voice issues, factual errors, and places Claude extrapolated. Then flip statuses `draft` → `live` in `lib/phases.ts`.

### 2. Resolve two open Arive questions
- Is there a SEPARATE "Loan Funded" borrower email, or is the "Loan Closed - Congratulations!" review email (fires at **Docs Signed**) the only one? (Bryce earlier said funded email exists; the template we have fires at Docs Signed — reconcile.)
- Audit which Arive milestones have automated borrower emails attached. Each one found → add to the Borrower Email Automations reference page.

### 3. The improvement analysis (do as its own session)
The payoff. Three systemic themes already visible:
- **Manual milestone updates = single point of failure, 7x.** Pre-Approved, Disclosure Sent, AWC, CTC, Docs Out, Docs Signed, Funded — all manual. Miss one → notifications/emails/reporting/automation silently fail. Likely explains part of the "webhook reliability gap" (webhook can't fire if the status was never set).
- **Handoffs depend on someone remembering.** LO→processing, Danielle→Hunter, Danielle→Emily — verbal/ad-hoc, no record, no backstop.
- **Post-close is nearly empty.** Warmest moment in the relationship, essentially nothing there. Highest-leverage improvement.

---

## SCRIBE QUEUE (9 pending — record on a dummy/test loan, scrub PII, embed via iframe)

Placeholders exist in the pages as "Scribe walkthrough pending". Bryce is on paid Scribe → embed inline. When recorded, send Claude the embed code + which step; Claude swaps the placeholder.

1. Starting a new application in Arive (phone path) — `application/take-application`
2. Credit pull screen, soft vs hard — `application/pull-credit`
3. Cloning a loan for a repeat borrower — `application/take-application`
4. Running dual AUS + where findings land — `application/run-aus`
5. Generating the pre-approval letter from template — `application/issue-preapproval`
6. Client Needs tab — auto-generate + add custom needs — `intake/generate-needs-list`
7. MISMO/FNM export from Arive — `disclosures/send-disclosures`
8. Title request email + attachments — `processing/file-setup`
9. Arive doc-download / building the UW submission package — `processing/uw-prep-and-submission`

**PII discipline for Scribes:** build one permanent "PLAYBOOK TEST" dummy loan, fake everything, DND on to kill notification popups, close other tabs (titles leak borrower names), filter Arive pipeline views before recording or blur them in Scribe's redaction tool. Review every frame before sharing.

---

## IMPROVEMENT BACKLOG (~18 items — raw material for the analysis session)

Milestone / automation:
- Manual milestone updates are a systemic single point of failure (all 7 milestones)
- Docs Signed & Loan Funded most frequently missed by Emily → breaks downstream + post-close emails
- May explain the Arive webhook reliability gap (nothing fires if status never set) — check before more Zapier diagnostics
- UWM/Arive API auto-updates CTC milestone but most LOs haven't enabled it
- AWC milestone flip is manual
- Pre-Approved milestone flip depends on LO remembering

Handoffs:
- LO→processing handoff: form adoption inconsistent; freeform Outlook/Teams today
- Handoff receipt-confirmation norm exists but inconsistent
- Handoff channel fragmentation (Outlook vs Teams)
- Danielle→Hunter condition handoff is verbal today; Arive assignment feature (auto-emails assignee) exists but underused
- Danielle→Emily at CTC: no handoff conversation, no context transfer, no backstop

Conditions:
- Conditions mirrored manually portal→Arive, no reconciliation (drift risk)

Borrower comms / templates:
- "EaseDocs" hardcoded in Loan Setup email but it's UWM-specific — wrong for other lenders
- Milestone emails depend on realtor contact accuracy with no failure signal
- Post-close review email fires at Docs Signed with "Loan Closed" subject — premature and factually wrong (not funded yet); cadence should wait 1-2 days
- Appraisal-payment heads-up (AMC emails borrower) missing from Hunter's punch list

Front-of-funnel:
- Lead handling fully manual, no system (GHL removed entirely — do NOT reintroduce)
- Pre-approved shopper nurture: no automation, purely LO-dependent
- Incomplete online-app follow-up: Arive email-only reminders; personal text outperforms
- On-demand letter updates (nights/weekends) fully manual LO burden
- First-response to leads varies by source (informal by design)
- Pre-handoff doc-monitoring gap: nobody consistently reviews uploads until handoff
- 24hr vs 48hr disclosure-signature SLA discrepancy across docs

Process doc:
- Pre-W structured checklist is Conventional Purchase only; other transaction types by judgment
- "Tax analysis" label in Pre-W spec is ambiguous (means property-tax-for-escrow, not income)

---

## EDITORIAL FLAGS (Claude-extrapolated content Bryce hasn't verified)

These were written from inference, not directly from Bryce. Verify during the review pass:
- Lead-intake: "no SLAs, intentional" framing; pitfalls list
- Take-application: co-borrower "don't share login" reasoning; borrower-error list
- Pull-credit: "no new debt while shopping" coaching; rescore scenario; ask-about-freezes tip
- Run-aus: diagnostic ordering (cheapest-first); "denied borrower → funded in 12 months" framing
- Disclosures: "warn borrower about lender email" framing; handoff-gated-on-signed inference
- File-setup: rate-lock confirmation REMOVED entirely (Bryce said it was wrong) — verify nothing lock-related is needed
- Phase 6: "frame it as progress" borrower-psychology; common-condition-types list; cross-check-Arive-vs-portal rec
- Phase 8: CD-gate stall reasons (inferred from checklist); wire-fraud "verify by phone" callout; re-disclosure warnings kept vague
- Phase 9: everything after the automated email is Claude's "what good looks like" — not current practice

---

## HARD ARCHITECTURE RULES (do not violate)
- Arive is the system of record. Playbook is reference only.
- No borrower PII anywhere in the public site. Dummy files only for Scribes.
- GHL is OUT of everything. Not lead automation, not comms, not status. Do not reintroduce.
- Document reality, including gaps — not idealized process.
- Each lender uses its own e-sign system (UWM = EaseDocs; others differ).
- Emily/UClose = UWM files only. Non-UWM files are closed by the lender's own closer.
