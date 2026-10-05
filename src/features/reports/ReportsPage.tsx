import { CircleDollarSign, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LoadState } from '../../components/LoadState';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { useCustomers } from '../customers/store';
import { totals } from '../finance/data';
import { useTransactions } from '../finance/store';
import { ORDER_STATUS, type OrderStatus } from '../orders/data';
import { useOrders } from '../orders/store';
import { isLowStock } from '../products/data';
import { useProducts } from '../products/store';
import { useTickets } from '../tickets/store';

const ALL = 'all';
const monthOf = (date: string) => date.slice(0, 7);
const monthLabel = (month: string) => `Tháng ${month.slice(5)}/${month.slice(0, 4)}`;

/** Read-only summary computed from the other collections; it has no endpoint of its own. */
export default function ReportsPage() {
  const orders = useOrders();
  const transactions = useTransactions();
  const products = useProducts();
  const customers = useCustomers();
  const tickets = useTickets();
  const [period, setPeriod] = useState(ALL);

  const sources = [orders, transactions, products, customers, tickets];
  const failed = sources.find((s) => s.status === 'error');
  const ready = sources.every((s) => s.status === 'ready');

  const months = useMemo(
    () => [...new Set([...orders.items.map((o) => monthOf(o.date)), ...transactions.items.map((t) => monthOf(t.date))])].sort().reverse(),
    [orders.items, transactions.items],
  );

  const inPeriod = (date: string) => period === ALL || monthOf(date) === period;
  const periodOrders = orders.items.filter((o) => inPeriod(o.date));
  const { income, expense, balance } = totals(transactions.items.filter((t) => inPeriod(t.date)));
  const openOrders = periodOrders.filter((o) => o.status !== 'cancelled');

  const byStatus = (Object.keys(ORDER_STATUS) as OrderStatus[])
    .filter((s) => s !== 'cancelled')
    .map((s) => {
      const list = periodOrders.filter((o) => o.status === s);
      return { status: s, count: list.length, total: list.reduce((sum, o) => sum + o.total, 0) };
    })
    .filter((row) => row.count > 0);

  return (
    <main id="main" className="content">
      <PageHeader
        eyebrow="Hệ thống"
        title="Báo cáo"
        lead="Tổng hợp từ các đơn hàng và phiếu thu chi do API cung cấp."
      />

      {!ready ? (
        <LoadState
          status={failed ? 'error' : 'loading'}
          error={failed?.error}
          onReload={() => sources.forEach((s) => void s.reload())}
        />
      ) : (
        <>
          <label className="report-period">
            Kỳ báo cáo
            <select className="input select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value={ALL}>Tất cả thời gian</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>
          </label>

          <section className="stats stats-4" aria-label="Chỉ số kỳ báo cáo">
            <StatCard label="Giá trị đơn chưa hủy" value={<Money tr={openOrders.reduce((s, o) => s + o.total, 0)} />} icon={ShoppingCart} />
            <StatCard label="Thực thu ghi nhận" value={<Money tr={income} />} icon={CircleDollarSign} />
            <StatCard label="Chi ghi nhận" value={<Money tr={expense} />} icon={CircleDollarSign} />
            <StatCard label="Thu trừ chi" value={<Money tr={balance} />} icon={CircleDollarSign} />
          </section>

          <div className="row row-2">
            <section className="card">
              <h2 className="report-title">Đơn hàng theo trạng thái</h2>
              <ul className="report-list">
                {byStatus.map(({ status, count, total }) => (
                  <li key={status}>
                    <span className={`pill ${ORDER_STATUS[status][1]}`}>{ORDER_STATUS[status][0]}</span>
                    <span>{count} đơn</span>
                    <strong><Money tr={total} /></strong>
                  </li>
                ))}
                {byStatus.length === 0 && <li className="report-empty">Không có đơn hàng trong kỳ này.</li>}
              </ul>
            </section>

            <section className="card">
              <h2 className="report-title">Kho &amp; khách hàng hiện tại</h2>
              <ul className="report-list">
                <li>
                  <span>Giá trị tồn kho theo giá vốn</span>
                  <strong><Money tr={products.items.reduce((s, p) => s + p.cost * p.stock, 0)} /></strong>
                </li>
                <li><span>Sản phẩm sắp hết hàng</span><strong>{products.items.filter(isLowStock).length}</strong></li>
                <li><span>Khách hàng</span><strong>{customers.items.length}</strong></li>
                <li><span>Ticket chưa đóng</span><strong>{tickets.items.filter((t) => t.status !== 'resolved').length}</strong></li>
              </ul>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
