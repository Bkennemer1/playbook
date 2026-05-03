// app/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PHASES, ROLE_META, Role } from '@/lib/phases';

const ROLE_ORDER: Role[] = ['lo', 'hunter', 'dan', 'emily', 'borrower', 'system'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeRoles, setActiveRoles] = useState<Set<Role>>(new Set());

  const toggleRole = (r: Role) => {
    setActiveRoles(prev => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r); else next.add(r);
      return next;
    });
  };

  const filteredPhases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PHASES.map(phase => {
      const filteredSteps = phase.steps.filter(step => {
        const matchesQuery = !q
          || step.title.toLowerCase().includes(q)
          || step.summary.toLowerCase().includes(q)
          || phase.title.toLowerCase().includes(q);
        const matchesRole = activeRoles.size === 0 || activeRoles.has(step.role);
        return matchesQuery && matchesRole;
      });
      return { ...phase, steps: filteredSteps };
    }).filter(p => p.steps.length > 0);
  }, [query, activeRoles]);

  return (
    <div className="container">
      <div className="page-hero">
        <h1>Life of the Loan — Playbook</h1>
        <p>Application through funded. Click any step for the full how-to.</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search steps — e.g. 'appraisal', 'CD', 'disclosures'"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="role-filter">
          {ROLE_ORDER.map(r => {
            const meta = ROLE_META[r];
            const isActive = activeRoles.has(r);
            return (
              <button
                key={r}
                className={`role-chip ${isActive ? 'active' : ''}`}
                onClick={() => toggleRole(r)}
                style={isActive ? { background: meta.color, borderColor: meta.color } : {}}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="phase-list">
        {filteredPhases.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 14 }}>
            No steps match those filters.
          </div>
        )}

        {filteredPhases.map(phase => {
          const isSystem = phase.primaryRole === 'system';
          return (
            <div key={phase.slug} className="phase">
              <div className="phase-head">
                <span className="phase-num">{phase.number}</span>
                <div className={`phase-bullet ${isSystem ? 'system' : ''}`}>{phase.letter}</div>
                <div className="phase-info">
                  <h2>{phase.title}</h2>
                  <div className="sub">{phase.subtitle}</div>
                </div>
                <Link href={`/phases/${phase.slug}`} className="phase-deep-link">
                  Phase overview →
                </Link>
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
                      <span
                        className="role-pill"
                        style={{ background: meta.pale, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
