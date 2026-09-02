// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Guarantee Mortgage Playbook',
  description: 'How a loan moves through Guarantee Mortgage — from application to funded.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-left">
            <Link href="/" className="brand">Guarantee Playbook</Link>
            <span className="sub">Internal team reference</span>
          </div>
          <nav className="site-nav">
            <Link href="/">All phases</Link>
            <Link href="/workflow">Workflow map</Link>
            <Link href="/reference/borrower-emails">Borrower emails</Link>
            <a href="https://pipeline.guaranteemc.com" target="_blank" rel="noopener">Pipeline</a>
            <a href="mailto:bryce@guaranteemc.com?subject=Playbook%20feedback">Report issue</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p><strong>Guarantee Mortgage</strong> · College Station, TX · NMLS #1808043</p>
          <p>Internal use only · playbook.guaranteemc.com</p>
        </footer>
      </body>
    </html>
  );
}
