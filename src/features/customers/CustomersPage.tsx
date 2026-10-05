import { CircleDollarSign, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { initials, unique } from '../../text';
import { CustomerForm } from './CustomerForm';
import { TYPE_LABEL, type Customer, type CustomerType } from './data';
import { useCustomers } from './store';

const columns: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Khách hàng',
    cell: (c) => (
      <div className="cell-main">
        <span className="row-avatar" aria-hidden="true">{initials(c.name)}</span>
        <div className="grow">
          <strong className="truncate">{c.name}</strong>
          <small>{c.id}</small>
        </div>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Phân loại',
    cell: (c) => <span className={`pill ${c.type === 'business' ? 'success' : 'info'}`}>{TYPE_LABEL[c.type]}</span>,
  },
  {
    key: 'contact',
    header: 'Liên hệ',
    cell: (c) => (
      <div className="stack">
        <span>{c.phone}</span>
        <small>{c.email}</small>
      </div>
    ),
  },
  { key: 'region', header: 'Khu vực', cell: (c) => c.region },
  { key: 'machines', header: 'Máy sở hữu', cell: (c) => c.machines },
  { key: 'spend', header: 'Tổng chi tiêu', cell: (c) => <strong><Money tr={c.spend} /></strong> },
  { key: 'owner', header: 'Phụ trách', cell: (c) => c.owner },
];

export default function CustomersPage() {
  const { items, status, error, reload } = useCustomers();
  const add = useCustomers((s) => s.add);
  const update = useCustomers((s) => s.update);
  const remove = useCustomers((s) => s.remove);

  return (
    <EntityListPage<Customer>
      eyebrow="CRM"
      title="Khách hàng"
      lead="Danh sách khách cá nhân và doanh nghiệp, tổng chi tiêu và người phụ trách."
      noun="khách hàng"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(c) => c.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng khách hàng" value={list.length} icon={Users} />
          <StatCard label="Khách doanh nghiệp (B2B)" value={list.filter((c) => c.type === 'business').length} icon={Users} />
          <StatCard label="Tổng chi tiêu lũy kế" value={<Money tr={list.reduce((s, c) => s + c.spend, 0)} />} icon={CircleDollarSign} />
        </>
      )}
      searchText={(c) => `${c.name} ${c.id} ${c.phone} ${c.email}`}
      searchPlaceholder="Tìm theo tên, mã, SĐT, email…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(TYPE_LABEL),
        test: (c, type) => c.type === (type as CustomerType),
      }}
      csv={{
        filename: 'khach-hang.csv',
        header: ['Mã', 'Tên', 'Phân loại', 'SĐT', 'Email', 'Khu vực', 'Máy sở hữu', 'Tổng chi tiêu (triệu đồng)', 'Phụ trách'],
        row: (c) => [c.id, c.name, TYPE_LABEL[c.type], c.phone, c.email, c.region, c.machines, c.spend, c.owner],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <CustomerForm
          regions={unique(items, (c) => c.region)}
          owners={unique(items, (c) => c.owner)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('KH', items.map((c) => c.id)), machines: 0, spend: 0 });
            done();
          }}
        />
      )}
    />
  );
}
