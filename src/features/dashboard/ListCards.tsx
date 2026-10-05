import { Link } from 'react-router';
import { Calendar, type LucideIcon } from 'lucide-react';
import { ORDER_STATUS } from '../orders/data';
import type { ListItem, RecentOrder, TopProduct, UpcomingInstall } from './data';
import { ArrowLink, CardHead, Money } from '../../components/ui';


interface WatchlistProps {
  title: string;
  icon: LucideIcon;
  to: string;
  items: ListItem[];
}

export function Watchlist({ title, icon, to, items }: WatchlistProps) {
  return (
    <section className="card">
      <CardHead icon={icon} iconTone="warn" title={title} sub={`${items.length} mục cần chú ý`} action={{ label: 'Chi tiết', to }} />
      <ul className="list">
        {items.map((it) => (
          <li key={it.name}>
            <span className="grow truncate">{it.name}</span>
            <span className="meta">{it.meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <section className="card">
      <CardHead title="Đơn hàng gần đây" sub={`${orders.length} đơn mới nhất`} action={{ label: 'Xem tất cả', to: '/don-hang' }} />
      <ul className="list list-lg">
        {orders.map((o) => {
          const [label, tone] = ORDER_STATUS[o.status];
          return (
            <li key={o.code}>
              <div className="grow">
                <Link className="name-link truncate" to="/don-hang">{o.customer}</Link>
                <small>{o.code}</small>
              </div>
              <span className={`pill ${tone}`}>{label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <section className="card">
      <CardHead title="Sản phẩm bán chạy" />
      <ol className="list list-lg">
        {products.map((p, i) => (
          <li key={p.name}>
            <span className="rank">{i + 1}</span>
            <div className="grow">
              <strong className="truncate">{p.name}</strong>
              <small>{p.category} · {p.sold} đã bán</small>
            </div>
            <strong className="amount"><Money tr={p.revenue} /></strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function UpcomingInstalls({ installs }: { installs: UpcomingInstall[] }) {
  return (
    <section className="card">
      <CardHead icon={Calendar} title="Lịch lắp đặt sắp tới" />
      <ul className="list list-lg">
        {installs.map((it) => (
          <li key={`${it.date}-${it.customer}`}>
            <time className="date-pill" dateTime={it.date}>{it.date}</time>
            <div className="grow">
              <strong className="truncate">{it.customer}</strong>
              <small className="truncate">{it.machine}</small>
            </div>
            <ArrowLink to="/lap-dat">Xem lịch</ArrowLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
