import { CircleDollarSign, FileText, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useOrders } from '../orders/store';
import { INVOICE_STATUS, type Invoice, type InvoiceStatus } from './data';
import { InvoiceForm } from './InvoiceForm';
import { useInvoices } from './store';

const columns: Column<Invoice>[] = [
  {
    key: 'customer',
    header: 'Tên',
    cell: (i) => (
      <div className="stack">
        <strong>{i.customer}</strong>
        <small>{i.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (i) => <span className="mono">{i.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (i) => {
      const [label, tone] = INVOICE_STATUS[i.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'orderId', header: 'Mã đơn hàng', cell: (i) => <span className="mono">{i.orderId}</span> },
  { key: 'amount', header: 'Tổng tiền (đ)', cell: (i) => <Money tr={i.amount} /> },
  { key: 'date', header: 'Ngày', cell: (i) => <span className="mono">{fmtDate(i.date)}</span> },
];

export default function InvoicesPage() {
  const { items, status, error, reload } = useInvoices();
  const add = useInvoices((s) => s.add);
  const remove = useInvoices((s) => s.remove);
  const orders = useOrders((s) => s.items);

  return (
    <EntityListPage<Invoice>
      eyebrow="Tài chính"
      title="Hóa đơn"
      lead="Chứng từ nội bộ minh họa; không phát hành hóa đơn điện tử."
      noun="hóa đơn"
      createLabel="Tạo chứng từ"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      onRemove={(item) => void remove(item.id)}
      columns={columns}
      rowKey={(i) => i.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={FileText} />
          <StatCard label="Tổng giá trị" value={<Money tr={list.reduce((s, i) => s + i.amount, 0)} />} icon={CircleDollarSign} />
          <StatCard label="Chờ xử lý" value={list.filter((i) => i.status === 'unpaid').length} icon={Wrench} />
        </>
      )}
      searchText={(i) => `${i.id} ${i.customer} ${i.orderId}`}
      searchPlaceholder="Tìm theo khách hàng, mã, đơn hàng…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(INVOICE_STATUS).map(([value, [label]]) => [value, label]),
        test: (i, value) => i.status === (value as InvoiceStatus),
      }}
      csv={{
        filename: 'hoa-don.csv',
        header: ['Mã', 'Khách hàng', 'Trạng thái', 'Mã đơn hàng', 'Tổng tiền (triệu đ)', 'Ngày'],
        row: (i) => [i.id, i.customer, INVOICE_STATUS[i.status][0], i.orderId, i.amount, fmtDate(i.date)],
      }}
      renderForm={(done) => (
        <InvoiceForm
          orders={orders}
          invoicedOrderIds={items.map((i) => i.orderId)}
          onCancel={done}
          onSubmit={(values) => {
            void add({ ...values, id: nextCode('HD', items.map((i) => i.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
