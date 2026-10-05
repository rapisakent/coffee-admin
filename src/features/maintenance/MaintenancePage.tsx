import { CircleCheck, ClipboardList, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { useCustomers } from '../customers/store';
import { useProducts } from '../products/store';
import { MAINTENANCE_STATUS, type Maintenance, type MaintenanceStatus } from './data';
import { MaintenanceForm } from './MaintenanceForm';
import { useMaintenance } from './store';

const columns: Column<Maintenance>[] = [
  {
    key: 'customer',
    header: 'Tên',
    cell: (m) => (
      <div className="stack">
        <strong>{m.customer}</strong>
        <small>{m.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (m) => <span className="mono">{m.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (m) => {
      const [label, tone] = MAINTENANCE_STATUS[m.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'device', header: 'Thiết bị', cell: (m) => m.device },
  { key: 'date', header: 'Ngày', cell: (m) => <span className="mono">{fmtDate(m.date)}</span> },
  { key: 'tech', header: 'Người phụ trách', cell: (m) => m.tech },
];

export default function MaintenancePage() {
  const { items, status, error, reload } = useMaintenance();
  const add = useMaintenance((s) => s.add);
  const update = useMaintenance((s) => s.update);
  const remove = useMaintenance((s) => s.remove);
  const customers = useCustomers((s) => s.items);
  const products = useProducts((s) => s.items);

  return (
    <EntityListPage<Maintenance>
      eyebrow="Kỹ thuật & hậu mãi"
      title="Bảo trì"
      lead="Lịch bảo trì định kỳ và kỹ thuật viên phụ trách."
      noun="lịch bảo trì"
      createLabel="Tạo lịch bảo trì"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(m) => m.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((m) => m.status !== 'done').length} icon={Wrench} />
          <StatCard label="Hoàn tất / đủ điều kiện" value={list.filter((m) => m.status === 'done').length} icon={CircleCheck} />
        </>
      )}
      searchText={(m) => `${m.id} ${m.customer} ${m.device} ${m.tech}`}
      searchPlaceholder="Tìm theo tên, mã, thiết bị…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(MAINTENANCE_STATUS).map(([value, [label]]) => [value, label]),
        test: (m, value) => m.status === (value as MaintenanceStatus),
      }}
      csv={{
        filename: 'bao-tri.csv',
        header: ['Mã', 'Mã KH', 'Khách hàng', 'Trạng thái', 'Thiết bị', 'Ngày', 'Kỹ thuật viên'],
        row: (m) => [m.id, m.customerId, m.customer, MAINTENANCE_STATUS[m.status][0], m.device, fmtDate(m.date), m.tech],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <MaintenanceForm
          customers={customers}
          products={products}
          technicians={unique(items, (m) => m.tech)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('BT', items.map((m) => m.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
