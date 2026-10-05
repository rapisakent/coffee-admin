import { CircleDollarSign, Package } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useCustomers } from '../customers/store';
import { useSuppliers } from '../suppliers/store';
import { DEBT_KIND, outstanding, remaining, type Debt, type DebtKind } from './data';
import { DebtForm } from './DebtForm';
import { useDebts } from './store';

const columns: Column<Debt>[] = [
  {
    key: 'party',
    header: 'Tên',
    cell: (d) => (
      <div className="stack">
        <strong>{d.party}</strong>
        <small>{d.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (d) => <span className="mono">{d.id}</span> },
  {
    key: 'kind',
    header: 'Phân loại / Trạng thái',
    cell: (d) => {
      const [label, tone] = DEBT_KIND[d.kind];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'total', header: 'Tổng tiền (đ)', cell: (d) => <Money tr={d.total} /> },
  { key: 'paid', header: 'Đã thanh toán', cell: (d) => <Money tr={d.paid} /> },
  { key: 'remaining', header: 'Còn lại', cell: (d) => <Money tr={remaining(d)} /> },
  { key: 'due', header: 'Ngày', cell: (d) => <span className="mono">{fmtDate(d.due)}</span> },
];

export default function DebtsPage() {
  const { items, status, error, reload } = useDebts();
  const add = useDebts((s) => s.add);
  const update = useDebts((s) => s.update);
  const remove = useDebts((s) => s.remove);
  const customers = useCustomers((s) => s.items);
  const suppliers = useSuppliers((s) => s.items);

  return (
    <EntityListPage<Debt>
      eyebrow="Tài chính"
      title="Công nợ"
      lead="Khoản phải thu, phải trả và số dư theo đối tác."
      noun="công nợ"
      createLabel="Thêm công nợ"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(d) => d.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Phải thu còn lại" value={<Money tr={outstanding(list, 'receivable')} />} icon={CircleDollarSign} />
          <StatCard label="Phải trả còn lại" value={<Money tr={outstanding(list, 'payable')} />} icon={CircleDollarSign} />
          <StatCard label="Số khoản công nợ" value={list.length} icon={Package} />
        </>
      )}
      searchText={(d) => `${d.id} ${d.party}`}
      searchPlaceholder="Tìm theo đối tác, mã…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(DEBT_KIND).map(([value, [label]]) => [value, label]),
        test: (d, value) => d.kind === (value as DebtKind),
      }}
      csv={{
        filename: 'cong-no.csv',
        header: ['Mã', 'Đối tác', 'Loại', 'Tổng tiền (triệu đ)', 'Đã thanh toán', 'Còn lại', 'Hạn thanh toán'],
        row: (d) => [d.id, d.party, DEBT_KIND[d.kind][0], d.total, d.paid, remaining(d), fmtDate(d.due)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <DebtForm
          parties={[...new Set([...customers.map((c) => c.name), ...suppliers.map((s) => s.name)])].sort()}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('CN', items.map((d) => d.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
