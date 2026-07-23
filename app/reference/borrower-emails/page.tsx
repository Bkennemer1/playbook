import Link from 'next/link';
import Content from '@/content/reference/borrower-emails.mdx';

export const metadata = { title: 'Borrower Email Automations — Guarantee Playbook' };

export default function BorrowerEmailsPage() {
  return (
    <div className="container">
      <div className="crumbs">
        <Link href="/">Playbook</Link>
        <span className="sep">/</span>
        <span>Borrower Email Automations</span>
      </div>
      <div className="step-page">
        <div className="step-page-head">
          <div style={{ flex: 1 }}>
            <h1>Borrower Email Automations</h1>
            <p className="step-summary">Every Arive milestone-triggered email the borrower receives — what fires it, who gets it, and exactly what it says.</p>
          </div>
        </div>
        <div className="mdx-content">
          <Content />
        </div>
      </div>
    </div>
  );
}
