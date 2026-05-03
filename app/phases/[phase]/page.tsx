// app/phases/[phase]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PHASES, findPhase, ROLE_META } from '@/lib/phases';

export function generateStaticParams() {
  return PHASES.map(p => ({ phase: p.slug }));
}

export default function PhasePage({ params }: { params: { phase: string } }) {
  const phase = findPhase(params.phase);
  if (!phase) notFound();

  const isSystem = phase.primaryRole === 'system';

  return (
    <div className="container">
      <div className="crumbs">
        <Link href="/">Playbook</Link>
        <span className="sep">/</span>
        <span>{phase.title}</span>
      </div>

      <div className="phase-detail-hero">
        <span className="phase-num">{phase.number}</span>
        <div className={`phase-bullet ${isSystem ? 'system' : ''}`}>{phase.letter}</div>
        <div className="phase-info">
          <h1>{phase.title}</h1>
          <div className="sub">{phase.subtitle}</div>
        </div>
      </div>

      <div className="phase">
        <div className="phase-head">
          <div className="phase-info">
            <h2 style={{ fontSize: 14 }}>Steps in this phase</h2>
            <div className="sub">Click into any step for the full how-to.</div>
          </div>
        </div>
        <div className="steps-list">
          {phase.steps.map(step => {
            const meta = ROLE_META[step.role];
            return (
              <Link
                key={step.slug}
                href={`/phases/${phase.slug}/${step.slug}`}
                className={`step-row ${step.status === 'skeleton' ? 'skeleton' : ''}`}
              >
                <span className="dot" style={{ borderColor: meta.color }} />
                <div className="step-info">
                  <div className="step-title">{step.title}</div>
                  <div className="step-summary">{step.summary}</div>
                </div>
                <span className="role-pill" style={{ background: meta.pale, color: meta.color }}>
                  {meta.label}
                </span>
                <span className="arrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
