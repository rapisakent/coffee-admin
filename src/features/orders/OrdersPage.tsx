import { CircleDollarSign, ShoppingCart, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useCustomers } from '../customers/store';
import { isActive, ORDER_STATUS, type Order, type OrderStatus } from './data';
import { OrderForm } from './OrderForm';
import { useOrders } from './store';

const columns: Column<Order>[] = [
  { key: 'id', header: 'Mã đơn hàng', cell: (o) => <span className="mono">{o.id}</span> },
  {
    key: 'customer',
    header: 'Khách hàng',
    cell: (o) => (
      <div className="stack">
        <strong>{o.customer}</strong>
        <small>{o.customerId}</small>
      </div>
    ),
  },
  { key: 'date', header: 'Ngày tạo', cell: (o) => fmtDate(o.date) },
  { key: 'total', header: 'Tổng tiền', cell: (o) => <strong><Money tr={o.total} /></strong> },
  {
    key: 'status',
    header: 'Trạng thái',
    cell: (o) => {
      const [label, tone] = ORDER_STATUS[o.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
];

export default function OrdersPage() {
  const { items, status, error, reload } = useOrders();
  const add = useOrders((s) => s.add);
  const update = useOrders((s) => s.update);
  const remove = useOrders((s) => s.remove);
  const customers = useCustomers((s) => s.items);

  return (
    <EntityListPage<Order>
      eyebrow="Bán hàng"
      title="Đơn hàng"
      lead="Theo dõi đơn hàng từ xác nhận, giao hàng đến lắp đặt và hoàn thành."
      noun="đơn hàng"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(o) => o.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng đơn hàng" value={list.length} icon={ShoppingCart} />
          <StatCard label="Đang thực hiện" value={list.filter(isActive).length} icon={Wrench} />
          <StatCard
            label="Giá trị đơn hàng"
            value={<Money tr={list.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)} />}
            icon={CircleDollarSign}
          />
        </>
      )}
      searchText={(o) => `${o.id} ${o.customer} ${o.customerId}`}
      searchPlaceholder="Tìm theo mã đơn, khách hàng…"
      filter={{
        label: 'Tất cả trạng thái',
        options: Object.entries(ORDER_STATUS).map(([value, [label]]) => [value, label]),
        test: (o, status) => o.status === (status as OrderStatus),
      }}
      csv={{
        filename: 'don-hang.csv',
        header: ['Mã đơn', 'Mã KH', 'Khách hàng', 'Ngày tạo', 'Tổng tiền (triệu đồng)', 'Trạng thái'],
        row: (o) => [o.id, o.customerId, o.customer, fmtDate(o.date), o.total, ORDER_STATUS[o.status][0]],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <OrderForm
          customers={customers}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('DH-2026', items.map((o) => o.id)) });
            done();
          }}
        />
      )}
    />
  );
}
