// app/workflow/page.tsx
import Link from 'next/link';
import { PHASES, ROLE_META } from '@/lib/phases';

export const metadata = { title: 'Workflow Map — Guarantee Playbook' };

export default function WorkflowPage() {
  return (
    <div className="container" style={{ maxWidth: 1200 }}>
      <div className="crumbs">
        <Link href="/">Playbook</Link>
        <span className="sep">/</span>
        <span>Workflow Map</span>
      </div>

      <div className="page-hero">
        <h1>Workflow Map</h1>
        <p>The whole loan at a glance — every phase, every step, who owns it. Tap any card to open its full how-to.</p>
      </div>

      <div className="board-scroll">
        <div className="board">
          {PHASES.map(phase => {
            const isSystem = phase.primaryRole === 'system';
            return (
              <div key={phase.slug} className="wf-column">
                <div className="wf-col-head">
                  <div className={`wf-col-bullet ${isSystem ? 'system' : ''}`}>{phase.letter}</div>
                  <div>
                    <div className="wf-col-num">{phase.number}</div>
                    <Link href={`/phases/${phase.slug}`} className="wf-col-name">{phase.title}</Link>
                  </div>
                </div>
                <div className="wf-col-body">
                  {phase.steps.map(step => {
                    const meta = ROLE_META[step.role];
                    return (
                      <Link
                        key={step.slug}
                        href={`/phases/${phase.slug}/${step.slug}`}
                        className="wf-card"
                        style={{ borderLeftColor: meta.color }}
                      >
                        <div className="wf-card-title">{step.title}</div>
                        <span className="wf-role-tag" style={{ background: meta.pale, color: meta.color }}>
                          {meta.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wf-legend">
        <span className="wf-legend-label">Roles</span>
        {(['lo','hunter','dan','emily','borrower','system'] as const).map(r => (
          <span key={r} className="wf-legend-item">
            <span className="wf-legend-dot" style={{ background: ROLE_META[r].color }} />
            {ROLE_META[r].label}
          </span>
        ))}
      </div>
    </div>
  );
}
