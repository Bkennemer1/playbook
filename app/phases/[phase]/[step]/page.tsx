// app/phases/[phase]/[step]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PHASES, findStep, adjacentSteps, ROLE_META } from '@/lib/phases';

export function generateStaticParams() {
  const params: { phase: string; step: string }[] = [];
  PHASES.forEach(p => p.steps.forEach(s => params.push({ phase: p.slug, step: s.slug })));
  return params;
}

export default async function StepPage({ params }: { params: Promise<{ phase: string; step: string }> }) {
  const { phase: phaseSlug, step: stepSlug } = await params;
  const found = findStep(phaseSlug, stepSlug);
  if (!found) notFound();
  const { phase, step } = found;

  const meta = ROLE_META[step.role];
  const { prev, next } = adjacentSteps(phaseSlug, stepSlug);

  // Try to load the MDX file. If it doesn't exist, show the placeholder.
  let MDXContent: any = null;
  try {
    MDXContent = (await import(`@/content/phases/${phaseSlug}/${stepSlug}.mdx`)).default;
  } catch (e) {
    MDXContent = null;
  }

  return (
    <div className="container">
      <div className="crumbs">
        <Link href="/">Playbook</Link>
        <span className="sep">/</span>
        <Link href={`/phases/${phase.slug}`}>{phase.title}</Link>
        <span className="sep">/</span>
        <span>{step.title}</span>
      </div>

      <div className="step-page">
        <div className="step-page-head">
          <div style={{ flex: 1 }}>
            <h1>{step.title}</h1>
            <p className="step-summary">{step.summary}</p>
            <div className="step-meta">
              <span>{phase.number}</span>
              <span className="dot">·</span>
              <span>Owner: {meta.label}</span>
              <span className="dot">·</span>
              <span>Status: {step.status}</span>
            </div>
          </div>
          <span
            className="role-pill"
            style={{ background: meta.pale, color: meta.color, padding: '6px 12px', fontSize: 11 }}
          >
            {meta.label}
          </span>
        </div>

        {MDXContent ? (
          <div className="mdx-content">
            <MDXContent />
          </div>
        ) : (
          <div className="placeholder-banner">
            <strong>Content coming soon.</strong> This step's deep-dive hasn't been written yet —
            it's still in the skeleton phase. Bryce is working through the playbook one phase at a
            time. The summary above and the role assignment are correct; the click-by-click how-to,
            screenshots, and email templates will land here once that phase's content brief is filled in.
          </div>
        )}

        <div className="step-nav">
          {prev ? (
            <Link href={`/phases/${prev.phaseSlug}/${prev.step.slug}`} className="step-nav-link">
              <div className="label">← Previous step</div>
              <div className="title">{prev.step.title}</div>
            </Link>
          ) : (
            <span className="step-nav-link disabled">
              <div className="label">← Previous</div>
              <div className="title">Start of playbook</div>
            </span>
          )}
          {next ? (
            <Link href={`/phases/${next.phaseSlug}/${next.step.slug}`} className="step-nav-link next">
              <div className="label">Next step →</div>
              <div className="title">{next.step.title}</div>
            </Link>
          ) : (
            <span className="step-nav-link next disabled">
              <div className="label">Next →</div>
              <div className="title">End of playbook</div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
