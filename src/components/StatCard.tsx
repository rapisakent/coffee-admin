import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <article className="card kpi">
      <div className="min-w-0">
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{value}</p>
      </div>
      <span className="kpi-icon"><Icon aria-hidden="true" /></span>
    </article>
  );
}
