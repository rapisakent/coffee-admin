import { CircleCheck, ClipboardList, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { useCustomers } from '../customers/store';
import { useProducts } from '../products/store';
import { INSTALL_STATUS, type Install, type InstallStatus } from './data';
import { InstallForm } from './InstallForm';
import { useInstalls } from './store';

const columns: Column<Install>[] = [
  {
    key: 'customer',
    header: 'Khách hàng',
    cell: (i) => (
      <div className="stack">
        <strong>{i.customer}</strong>
        <small>{i.id}</small>
      </div>
    ),
  },
  { key: 'device', header: 'Thiết bị', cell: (i) => i.device },
  { key: 'date', header: 'Ngày lắp đặt', cell: (i) => <span className="mono">{fmtDate(i.date)}</span> },
  { key: 'tech', header: 'Kỹ thuật viên', cell: (i) => i.tech },
  {
    key: 'status',
    header: 'Trạng thái',
    cell: (i) => {
      const [label, tone] = INSTALL_STATUS[i.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
];

export default function InstallsPage() {
  const { items, status, error, reload } = useInstalls();
  const add = useInstalls((s) => s.add);
  const update = useInstalls((s) => s.update);
  const remove = useInstalls((s) => s.remove);
  const customers = useCustomers((s) => s.items);
  const products = useProducts((s) => s.items);

  return (
    <EntityListPage<Install>
      eyebrow="Kỹ thuật & hậu mãi"
      title="Lắp đặt"
      lead="Lịch lắp đặt máy, người phụ trách và tiến độ thực hiện."
      noun="lịch lắp đặt"
      createLabel="Tạo lịch lắp đặt"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(i) => i.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang thực hiện" value={list.filter((i) => i.status !== 'done').length} icon={Wrench} />
          <StatCard label="Hoàn thành" value={list.filter((i) => i.status === 'done').length} icon={CircleCheck} />
        </>
      )}
      searchText={(i) => `${i.id} ${i.customer} ${i.device} ${i.tech}`}
      searchPlaceholder="Tìm theo khách hàng, thiết bị, kỹ thuật viên…"
      filter={{
        label: 'Tất cả trạng thái',
        options: Object.entries(INSTALL_STATUS).map(([value, [label]]) => [value, label]),
        test: (i, status) => i.status === (status as InstallStatus),
      }}
      csv={{
        filename: 'lap-dat.csv',
        header: ['Mã', 'Mã KH', 'Khách hàng', 'Thiết bị', 'Ngày lắp đặt', 'Kỹ thuật viên', 'Trạng thái'],
        row: (i) => [i.id, i.customerId, i.customer, i.device, fmtDate(i.date), i.tech, INSTALL_STATUS[i.status][0]],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <InstallForm
          customers={customers}
          products={products}
          technicians={unique(items, (i) => i.tech)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('LD', items.map((i) => i.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
