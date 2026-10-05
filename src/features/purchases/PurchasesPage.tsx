import { CircleDollarSign, FileText, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useSuppliers } from '../suppliers/store';
import { PURCHASE_STATUS, type Purchase, type PurchaseStatus } from './data';
import { PurchaseForm } from './PurchaseForm';
import { usePurchases } from './store';

const columns: Column<Purchase>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (p) => (
      <div className="stack">
        <strong>{p.name}</strong>
        <small>{p.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (p) => <span className="mono">{p.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (p) => {
      const [label, tone] = PURCHASE_STATUS[p.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'supplier', header: 'Nhà cung cấp', cell: (p) => p.supplier },
  { key: 'amount', header: 'Tổng tiền (đ)', cell: (p) => <Money tr={p.amount} /> },
  { key: 'date', header: 'Ngày', cell: (p) => <span className="mono">{fmtDate(p.date)}</span> },
];

export default function PurchasesPage() {
  const { items, status, error, reload } = usePurchases();
  const add = usePurchases((s) => s.add);
  const update = usePurchases((s) => s.update);
  const remove = usePurchases((s) => s.remove);
  const suppliers = useSuppliers((s) => s.items);

  return (
    <EntityListPage<Purchase>
      eyebrow="Mua hàng"
      title="Đơn mua hàng"
      lead="Đơn đặt nhà cung cấp và ngày giao dự kiến; nhận hàng qua phiếu nhập kho."
      noun="đơn mua"
      createLabel="Tạo đơn mua"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(p) => p.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={FileText} />
          <StatCard label="Tổng giá trị" value={<Money tr={list.reduce((s, p) => s + p.amount, 0)} />} icon={CircleDollarSign} />
          <StatCard label="Chờ xử lý" value={list.filter((p) => p.status === 'pending').length} icon={Wrench} />
        </>
      )}
      searchText={(p) => `${p.id} ${p.name} ${p.supplier}`}
      searchPlaceholder="Tìm theo tên, mã, nhà cung cấp…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(PURCHASE_STATUS).map(([value, [label]]) => [value, label]),
        test: (p, value) => p.status === (value as PurchaseStatus),
      }}
      csv={{
        filename: 'don-mua-hang.csv',
        header: ['Mã', 'Nội dung', 'Trạng thái', 'Nhà cung cấp', 'Tổng tiền (triệu đ)', 'Ngày giao dự kiến'],
        row: (p) => [p.id, p.name, PURCHASE_STATUS[p.status][0], p.supplier, p.amount, fmtDate(p.date)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <PurchaseForm
          suppliers={suppliers}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('MH', items.map((p) => p.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
