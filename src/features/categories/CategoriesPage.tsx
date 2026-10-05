import { ClipboardList, ShieldCheck, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { CATEGORY_STATUS, type Category, type CategoryStatus } from './data';
import { CategoryForm } from './CategoryForm';
import { useCategories } from './store';

const columns: Column<Category>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (c) => (
      <div className="stack">
        <strong>{c.name}</strong>
        <small>{c.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (c) => <span className="mono">{c.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (c) => {
      const [label, tone] = CATEGORY_STATUS[c.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
];

export default function CategoriesPage() {
  const { items, status, error, reload } = useCategories();
  const add = useCategories((s) => s.add);
  const update = useCategories((s) => s.update);
  const remove = useCategories((s) => s.remove);

  return (
    <EntityListPage<Category>
      eyebrow="Sản phẩm"
      title="Danh mục"
      lead="Nhóm sản phẩm và mô tả danh mục kinh doanh."
      noun="danh mục"
      createLabel="Thêm danh mục"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(c) => c.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((c) => c.status === 'active').length} icon={Users} />
          <StatCard label="Ngừng dùng" value={list.filter((c) => c.status === 'inactive').length} icon={ShieldCheck} />
        </>
      )}
      searchText={(c) => `${c.id} ${c.name}`}
      searchPlaceholder="Tìm theo tên, mã…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(CATEGORY_STATUS).map(([value, [label]]) => [value, label]),
        test: (c, status) => c.status === (status as CategoryStatus),
      }}
      csv={{
        filename: 'danh-muc.csv',
        header: ['Mã', 'Tên', 'Trạng thái'],
        row: (c) => [c.id, c.name, CATEGORY_STATUS[c.status][0]],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <CategoryForm
          names={items.filter((c) => c.id !== editing?.id).map((c) => c.name)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('DM', items.map((c) => c.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
