import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { money } from '../lib';

export function Money({ tr }: { tr: number }) {
  return <>{money(tr)} <span className="cur">₫</span></>;
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="link" to={to}>
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

interface CardHeadProps {
  title: string;
  sub?: string;
  icon?: LucideIcon;
  iconTone?: 'warn';
  action?: { label: string; to: string };
}

export function CardHead({ title, sub, icon: Icon, iconTone, action }: CardHeadProps) {
  return (
    <header className="card-head">
      <div className="min-w-0">
        <h2>
          {Icon && <Icon className={`head-icon ${iconTone ?? ''}`} aria-hidden="true" />}
          {title}
        </h2>
        {sub && <p>{sub}</p>}
      </div>
      {action && <ArrowLink to={action.to}>{action.label}</ArrowLink>}
    </header>
  );
}
