import { CircleDollarSign, ShoppingCart, TrendingDown, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MonthStat } from './data';
import { fmt, growth } from '../../lib';
import { Money } from '../../components/ui';

interface Kpi {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  delta?: number;
  note?: string;
}

function Delta({ value }: { value: number }) {
  const Icon = value < 0 ? TrendingDown : TrendingUp;
  return (
    <span className={`delta ${value < 0 ? 'down' : 'up'}`}>
      <Icon aria-hidden="true" />
      {value > 0 ? '+' : ''}
      {fmt(value)}%
    </span>
  );
}

interface Props {
  monthly: MonthStat[];
  newCustomers: { current: number; previous: number };
}

export function KpiCards({ monthly, newCustomers }: Props) {
  const [prev, cur] = monthly.slice(-2);
  const kpis: Kpi[] = [
    {
      label: 'Doanh thu tháng này',
      value: <Money tr={cur.revenue} />,
      icon: CircleDollarSign,
      delta: growth(cur.revenue, prev.revenue),
      note: 'so với tháng trước',
    },
    {
      label: 'Đơn hàng',
      value: cur.orders,
      icon: ShoppingCart,
      delta: growth(cur.orders, prev.orders),
      note: 'so với tháng trước',
    },
    {
      label: 'Khách hàng mới',
      value: newCustomers.current,
      icon: Users,
      delta: growth(newCustomers.current, newCustomers.previous),
    },
    {
      label: 'Giá trị đơn trung bình',
      value: <Money tr={cur.revenue / cur.orders} />,
      icon: CircleDollarSign,
      note: 'trên mỗi đơn trong tháng',
    },
  ];

  return (
    <section className="kpis" aria-label="Chỉ số chính">
      {kpis.map(({ label, value, icon: Icon, delta, note }) => (
        <article key={label} className="card kpi">
          <div className="min-w-0">
            <p className="kpi-label">{label}</p>
            <p className="kpi-value">{value}</p>
          </div>
          <span className="kpi-icon"><Icon aria-hidden="true" /></span>
          <p className="kpi-foot">
            {delta !== undefined && <Delta value={delta} />}
            {note}
          </p>
        </article>
      ))}
    </section>
  );
}
