import { ClipboardList, ShieldCheck, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { useCustomers } from '../customers/store';
import { useProducts } from '../products/store';
import { needsAction, SERIAL_STATUS, type Serial, type SerialStatus } from './data';
import { SerialForm } from './SerialForm';
import { useSerials } from './store';

const columns: Column<Serial>[] = [
  { key: 'id', header: 'Serial', cell: (s) => <span className="mono">{s.id}</span> },
  {
    key: 'product',
    header: 'Sản phẩm',
    cell: (s) => (
      <div className="stack">
        <strong>{s.product}</strong>
        <small>{s.productId}</small>
      </div>
    ),
  },
  { key: 'customer', header: 'Khách hàng', cell: (s) => s.customer },
  {
    key: 'status',
    header: 'Trạng thái',
    cell: (s) => {
      const [label, tone] = SERIAL_STATUS[s.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
];

export default function SerialsPage() {
  const { items, status, error, reload } = useSerials();
  const add = useSerials((s) => s.add);
  const update = useSerials((s) => s.update);
  const remove = useSerials((s) => s.remove);
  const products = useProducts((s) => s.items);
  const customers = useCustomers((s) => s.items);

  return (
    <EntityListPage<Serial>
      eyebrow="Kho"
      title="Serial máy"
      lead="Quản lý từng máy theo serial và trạng thái sử dụng."
      noun="serial"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(s) => s.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang thực hiện" value={list.filter(needsAction).length} icon={Wrench} />
          <StatCard label="Đang bảo hành" value={list.filter((s) => s.status === 'warranty').length} icon={ShieldCheck} />
        </>
      )}
      searchText={(s) => `${s.id} ${s.product} ${s.productId} ${s.customer}`}
      searchPlaceholder="Tìm theo serial, sản phẩm, khách hàng…"
      filter={{
        label: 'Tất cả trạng thái',
        options: Object.entries(SERIAL_STATUS).map(([value, [label]]) => [value, label]),
        test: (s, status) => s.status === (status as SerialStatus),
      }}
      csv={{
        filename: 'serial-may.csv',
        header: ['Serial', 'SKU', 'Sản phẩm', 'Mã KH', 'Khách hàng', 'Trạng thái'],
        row: (s) => [s.id, s.productId, s.product, s.customerId, s.customer, SERIAL_STATUS[s.status][0]],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <SerialForm
          products={products}
          customers={customers}
          existingIds={items.filter((s) => s.id !== editing?.id).map((s) => s.id)}
          onCancel={done}
          onSubmit={(serial) => {
            if (editing) void update(editing.id, serial);
            else void add(serial);
            done();
          }}
        />
      )}
    />
  );
}
