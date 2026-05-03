# Guarantee Mortgage Playbook

The internal life-of-loan reference for the Guarantee Mortgage team.
Lives at **playbook.guaranteemc.com**.

## What this is

A public-facing (no auth) Next.js + MDX site that documents how a loan moves through Guarantee Mortgage from application to funded. The homepage is the timeline. Each step links to a deep-dive page with click paths, screenshots, email templates, and troubleshooting.

## Stack

- Next.js 15 (App Router)
- MDX for content
- Plain CSS (no framework — matches the pipeline app aesthetic)
- Deployed on Vercel from this GitHub repo

## Project structure

```
playbook/
├── app/
│   ├── globals.css                       ← all styles
│   ├── layout.tsx                        ← site header + footer
│   ├── page.tsx                          ← homepage (timeline + search + filter)
│   └── phases/
│       └── [phase]/
│           ├── page.tsx                  ← phase landing page
│           └── [step]/
│               └── page.tsx              ← step detail (loads MDX)
├── content/
│   └── phases/
│       ├── _TEMPLATE.mdx                 ← copy this for new content
│       ├── application/
│       ├── intake/
│       ├── handoff/
│       │   └── submit-handoff-form.mdx   ← example of a finished step
│       └── (etc — one folder per phase)
├── lib/
│   └── phases.ts                         ← single source of truth for structure
└── public/
    └── screenshots/                      ← drop screenshots here, organized by phase
```

## Adding content for a step

1. In `content/phases/[phase-slug]/`, create a file named `[step-slug].mdx`
2. Copy the contents of `content/phases/_TEMPLATE.mdx` and edit
3. For screenshots: save them to `public/screenshots/[phase-slug]/[descriptive-name].png` and reference as `<img src="/screenshots/[phase]/[file].png" />`
4. Commit and push — Vercel auto-deploys

That's it. No code changes required to add or edit step content.

## Adding a new step or phase

Edit `lib/phases.ts` — that's the single source of truth for what shows up on the homepage and in navigation. Add the entry, then create the matching MDX file in `content/phases/`.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to GitHub (e.g. `guarantee-mortgage/playbook`)
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo
3. Default settings work. Click Deploy.
4. After deploy, go to the Vercel project → Settings → Domains
5. Add `playbook.guaranteemc.com`
6. Vercel will give you a CNAME or A record to add to your DNS provider for `guaranteemc.com`
7. Once DNS propagates (usually <10 min), the site is live

## Maintenance

- Each step has a "Last reviewed" line in the meta. Update it when you refresh content.
- The "Report issue" link in the header goes to bryce@guaranteemc.com — encourage the team to flag stale content.
- Screenshots will go stale every time Arive ships a UI update. Plan for periodic refreshes (every 6 months minimum).

## Status legend

In `lib/phases.ts`, each step has a `status` field:
- `skeleton` — placeholder only, shown with "DRAFT" tag and placeholder banner
- `draft` — content exists but is being reviewed
- `live` — finalized and approved
