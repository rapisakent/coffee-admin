import { ClipboardList, ShieldCheck, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { useCategories } from '../categories/store';
import type { Supplier } from './data';
import { useSuppliers } from './store';
import { SupplierForm } from './SupplierForm';
import { unique } from '../../text';

const columns: Column<Supplier>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (s) => (
      <div className="stack">
        <strong>{s.name}</strong>
        <small>{s.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (s) => <span className="mono">{s.id}</span> },
  {
    key: 'category',
    header: 'Phân loại / Trạng thái',
    cell: (s) => <span className={`pill ${s.active ? 'success' : 'warn'}`}>{s.category}</span>,
  },
  {
    key: 'contact',
    header: 'Số điện thoại',
    cell: (s) => (
      <div className="stack">
        <span>{s.phone}</span>
        <small>{s.email}</small>
      </div>
    ),
  },
  { key: 'region', header: 'Khu vực', cell: (s) => s.region },
  { key: 'terms', header: 'Điều khoản thanh toán', cell: (s) => s.terms },
];

export default function SuppliersPage() {
  const { items, status, error, reload } = useSuppliers();
  const add = useSuppliers((s) => s.add);
  const update = useSuppliers((s) => s.update);
  const remove = useSuppliers((s) => s.remove);
  const categories = useCategories((s) => s.items);

  return (
    <EntityListPage<Supplier>
      eyebrow="Mua hàng"
      title="Nhà cung cấp"
      lead="Danh bạ nhà cung cấp và điều khoản thanh toán."
      noun="nhà cung cấp"
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
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((s) => s.active).length} icon={Users} />
          <StatCard label="Ngừng hợp tác" value={list.filter((s) => !s.active).length} icon={ShieldCheck} />
        </>
      )}
      searchText={(s) => `${s.id} ${s.name} ${s.phone} ${s.email} ${s.region} ${s.category}`}
      searchPlaceholder="Tìm theo tên, mã, SĐT, email…"
      filter={{
        label: 'Tất cả phân loại',
        options: unique(items, (s) => s.category).map((c) => [c, c]),
        test: (s, category) => s.category === category,
      }}
      csv={{
        filename: 'nha-cung-cap.csv',
        header: ['Mã', 'Tên', 'Nhóm hàng', 'Số điện thoại', 'Email', 'Khu vực', 'Điều khoản thanh toán'],
        row: (s) => [s.id, s.name, s.category, s.phone, s.email, s.region, s.terms],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <SupplierForm
          categories={categories}
          regions={unique(items, (s) => s.region)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('NCC', items.map((s) => s.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
