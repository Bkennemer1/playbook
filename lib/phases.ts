// lib/phases.ts
// Single source of truth for the playbook structure.
// Add or rename phases/steps here; pages are generated from this list.

export type Role = 'lo' | 'processor' | 'closer' | 'borrower' | 'system';

export interface Step {
  slug: string;
  title: string;
  role: Role;
  summary: string;
  status: 'skeleton' | 'draft' | 'live';
}

export interface Phase {
  slug: string;
  number: string;
  letter: string;
  title: string;
  subtitle: string;
  primaryRole: Role;
  steps: Step[];
}

export const ROLE_META: Record<Role, { label: string; color: string; pale: string; }> = {
  lo:        { label: 'Loan Officer',    color: '#500000', pale: '#F9F0F0' },
  processor: { label: 'Processor',       color: '#0F6E56', pale: '#E1F5EE' },
  closer:    { label: 'Closer',          color: '#3B6D11', pale: '#EAF3DE' },
  borrower:  { label: 'Borrower',        color: '#B8860B', pale: '#FAF1DC' },
  system:    { label: 'System / Arive',  color: '#5F5E5A', pale: '#F1EFE8' },
};

export const PHASES: Phase[] = [
  {
    slug: 'application',
    number: 'PHASE 1',
    letter: 'A',
    title: 'Application & Pre-Approval',
    subtitle: 'LO ownership · Arive: Application Intake → Pre-Approved',
    primaryRole: 'lo',
    steps: [
      { slug: 'lead-intake-qualifying',  title: 'Lead intake & qualifying conversation', role: 'lo', summary: 'First contact with borrower; gather basics; decide soft vs. hard credit.', status: 'draft' },
      { slug: 'take-application',        title: 'Take the application', role: 'lo', summary: 'Two paths: phone-taken by LO vs. borrower self-serves via online URL.', status: 'draft' },
      { slug: 'pull-credit',             title: 'Pull credit', role: 'lo', summary: 'Soft or hard pull based on borrower preference; tri-merge in Arive.', status: 'draft' },
      { slug: 'run-aus',                 title: 'Run DU/LP (AUS)', role: 'lo', summary: 'Submit to AUS, review findings, troubleshoot if needed.', status: 'draft' },
      { slug: 'issue-preapproval',       title: 'Issue pre-approval letter', role: 'lo', summary: 'Generate and send pre-approval; track who has it.', status: 'draft' },
    ],
  },
  {
    slug: 'intake',
    number: 'PHASE 2',
    letter: 'B',
    title: 'Document Intake',
    subtitle: 'LO curates the needs list · borrower self-uploads · Arive: Loan Setup',
    primaryRole: 'lo',
    steps: [
      { slug: 'generate-needs-list',     title: 'Generate & curate the client needs list', role: 'lo', summary: 'Auto-generate the basics; manually add the custom needs Arive misses.', status: 'draft' },
      { slug: 'borrower-portal-upload',  title: 'Borrower uploads docs via portal', role: 'borrower', summary: 'Self-serve upload against the needs list; items pend until reviewed.', status: 'draft' },
    ],
  },
  {
    slug: 'disclosures',
    number: 'PHASE 3',
    letter: 'C',
    title: 'Disclosures',
    subtitle: 'LO preps & sends · e-signed within the TRID window · Arive: Disclosure Sent',
    primaryRole: 'lo',
    steps: [
      { slug: 'send-disclosures',        title: 'Prep & send initial disclosures', role: 'lo', summary: 'LO owns disclosures — sent and e-signed before the processing handoff.', status: 'draft' },
    ],
  },
  {
    slug: 'handoff',
    number: 'PHASE 4',
    letter: 'D',
    title: 'Handoff to Processing',
    subtitle: 'LO hands off · processor runs Pre-W and starts file setup',
    primaryRole: 'lo',
    steps: [
      { slug: 'submit-handoff-form',     title: 'Submit processing handoff form', role: 'lo', summary: 'Outlook or Teams message to the processor — use the Pass to Processing form.', status: 'draft' },
      { slug: 'pre-underwriting-review', title: 'Pre-Underwriting Review (Pre-W)', role: 'processor', summary: 'The processor reviews the file for missing docs, inconsistencies, and borrower needs — first review within 48 hours.', status: 'draft' },
    ],
  },
  {
    slug: 'processing',
    number: 'PHASE 5',
    letter: 'E',
    title: 'Initial Processing & UW Submission',
    subtitle: 'Processor-owned · Arive: UW Submitted',
    primaryRole: 'processor',
    steps: [
      { slug: 'file-setup',              title: 'File setup', role: 'processor', summary: 'Title, appraisal, contract review, CD party info, VOEs.', status: 'draft' },
      { slug: 'uw-prep-and-submission',  title: 'UW prep & submission', role: 'processor', summary: 'Compliance scrub; submit to underwriting.', status: 'draft' },
    ],
  },
  {
    slug: 'uw-decision',
    number: 'PHASE 6',
    letter: 'F',
    title: 'UW Decision · Approved with Conditions',
    subtitle: 'The processor triages and works every condition — borrower-facing and back-office — to Ready to Send',
    primaryRole: 'processor',
    steps: [
      { slug: 'awc-trigger',             title: 'AWC returned — triage the conditions', role: 'processor', summary: 'The processor reads the approval letter, then enters and tracks every condition in Arive.', status: 'draft' },
      { slug: 'borrower-conditions',     title: 'Borrower-facing conditions', role: 'processor', summary: 'The processor collects outstanding docs from the borrower.', status: 'draft' },
      { slug: 'docs-and-arive-conditions', title: 'Docs, uploads & Arive conditions', role: 'processor', summary: 'The processor clears title/appraisal/HOI conditions and re-submits to UW.', status: 'draft' },
    ],
  },
  {
    slug: 'ctc',
    number: 'PHASE 7',
    letter: 'G',
    title: 'Clear to Close',
    subtitle: 'Milestone flips to CTC · Arive notifies the closer',
    primaryRole: 'system',
    steps: [
      { slug: 'ctc-issued',              title: 'UW issues clear to close', role: 'system', summary: 'Milestone flips to CTC and Arive notifies the closer. Manual today, with no backstop.', status: 'draft' },
    ],
  },
  {
    slug: 'closing',
    number: 'PHASE 8',
    letter: 'H',
    title: 'Closing',
    subtitle: 'The closer owns CTC through funded (UWM files) · Arive: Docs Out → Funded',
    primaryRole: 'closer',
    steps: [
      { slug: 'review-ctc', title: 'Pick up the file & clear the CD gate', role: 'closer', summary: 'Get oriented, then work the checklist every lender requires before a CD can issue.', status: 'draft' },
      { slug: 'cd-issued', title: 'CD issued & the 3-day clock', role: 'closer', summary: 'Auto-generated at UWM, requested elsewhere — then TRID timing governs.', status: 'draft' },
      { slug: 'balance-and-final-cd', title: 'Balance with title & send the final CD', role: 'closer', summary: 'Iterative reconciliation in UClose, LO approval, then the final CD to the borrower.', status: 'draft' },
      { slug: 'signing-through-funded', title: 'Signing through funded', role: 'closer', summary: 'Realtor schedules signing; the closer tracks docs signed and the funding wire.', status: 'draft' },
    ],
  },
  {
    slug: 'post-close',
    number: 'PHASE 9',
    letter: 'I',
    title: 'Post-Close',
    subtitle: 'Automated review request at Docs Signed · LO follow-up is inconsistent',
    primaryRole: 'lo',
    steps: [
      { slug: 'post-close-followup',     title: 'Review request & post-close follow-up', role: 'lo', summary: 'Automated Google review email fires at Docs Signed; everything after is up to the LO.', status: 'draft' },
    ],
  },
];

export function findPhase(slug: string): Phase | undefined {
  return PHASES.find(p => p.slug === slug);
}

export function findStep(phaseSlug: string, stepSlug: string): { phase: Phase; step: Step } | undefined {
  const phase = findPhase(phaseSlug);
  if (!phase) return undefined;
  const step = phase.steps.find(s => s.slug === stepSlug);
  if (!step) return undefined;
  return { phase, step };
}

export function adjacentSteps(phaseSlug: string, stepSlug: string) {
  const flat: { phaseSlug: string; phaseTitle: string; step: Step }[] = [];
  PHASES.forEach(p => p.steps.forEach(s => flat.push({ phaseSlug: p.slug, phaseTitle: p.title, step: s })));
  const idx = flat.findIndex(f => f.phaseSlug === phaseSlug && f.step.slug === stepSlug);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
