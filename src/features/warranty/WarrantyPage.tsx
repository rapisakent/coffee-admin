import { CircleCheck, ClipboardList, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { useSerials } from '../serials/store';
import { WARRANTY_STATUS, type WarrantyStatus, type WarrantyTicket } from './data';
import { useWarranty } from './store';
import { WarrantyForm } from './WarrantyForm';
import { unique } from '../../text';

const columns: Column<WarrantyTicket>[] = [
  { key: 'serial', header: 'Serial máy', cell: (t) => <span className="mono">{t.serial}</span> },
  {
    key: 'customer',
    header: 'Khách hàng',
    cell: (t) => (
      <div className="stack">
        <strong>{t.customer}</strong>
        <small>{t.id}</small>
      </div>
    ),
  },
  { key: 'device', header: 'Thiết bị', cell: (t) => t.device },
  {
    key: 'status',
    header: 'Trạng thái',
    cell: (t) => {
      const [label, tone] = WARRANTY_STATUS[t.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'owner', header: 'Phụ trách', cell: (t) => t.owner },
];

export default function WarrantyPage() {
  const { items, status, error, reload } = useWarranty();
  const add = useWarranty((s) => s.add);
  const update = useWarranty((s) => s.update);
  const remove = useWarranty((s) => s.remove);
  const serials = useSerials((s) => s.items);

  return (
    <EntityListPage<WarrantyTicket>
      eyebrow="Kỹ thuật & hậu mãi"
      title="Bảo hành"
      lead="Theo dõi yêu cầu bảo hành, kiểm tra và sửa chữa thiết bị."
      noun="yêu cầu bảo hành"
      createLabel="Tạo yêu cầu"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(t) => t.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang thực hiện" value={list.filter((t) => t.status !== 'done').length} icon={Wrench} />
          <StatCard label="Hoàn thành" value={list.filter((t) => t.status === 'done').length} icon={CircleCheck} />
        </>
      )}
      searchText={(t) => `${t.id} ${t.serial} ${t.customer} ${t.device} ${t.owner}`}
      searchPlaceholder="Tìm theo serial, khách hàng, thiết bị…"
      filter={{
        label: 'Tất cả trạng thái',
        options: Object.entries(WARRANTY_STATUS).map(([value, [label]]) => [value, label]),
        test: (t, status) => t.status === (status as WarrantyStatus),
      }}
      csv={{
        filename: 'bao-hanh.csv',
        header: ['Mã', 'Serial', 'Mã KH', 'Khách hàng', 'Thiết bị', 'Trạng thái', 'Phụ trách'],
        row: (t) => [t.id, t.serial, t.customerId, t.customer, t.device, WARRANTY_STATUS[t.status][0], t.owner],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <WarrantyForm
          serials={serials}
          owners={unique(items, (t) => t.owner)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('BH', items.map((t) => t.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
