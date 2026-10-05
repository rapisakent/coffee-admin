import type { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, lead, actions }: Props) {
  return (
    <div className="page-head">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
