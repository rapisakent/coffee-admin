import { ClipboardList, ShieldCheck, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { ROLES, type AppUser } from './data';
import { useUsers } from './store';
import { UserForm } from './UserForm';

const columns: Column<AppUser>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (u) => (
      <div className="stack">
        <strong>{u.name}</strong>
        <small>{u.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (u) => <span className="mono">{u.id}</span> },
  { key: 'email', header: 'Email', cell: (u) => u.email },
  {
    key: 'active',
    header: 'Phân loại / Trạng thái',
    cell: (u) => <span className={`pill ${u.active ? 'success' : 'warn'}`}>{u.active ? 'Hoạt động' : 'Ngừng hoạt động'}</span>,
  },
  { key: 'role', header: 'Vai trò', cell: (u) => u.role },
];

export default function UsersPage() {
  const { items, status, error, reload } = useUsers();
  const add = useUsers((s) => s.add);
  const update = useUsers((s) => s.update);
  const remove = useUsers((s) => s.remove);

  return (
    <EntityListPage<AppUser>
      eyebrow="Hệ thống"
      title="Người dùng & phân quyền"
      lead="Vai trò minh họa cho giao diện; bản HTML không có xác thực hay phân quyền thật."
      noun="người dùng"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(u) => u.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((u) => u.active).length} icon={Users} />
          <StatCard label="Ngừng hoạt động" value={list.filter((u) => !u.active).length} icon={ShieldCheck} />
        </>
      )}
      searchText={(u) => `${u.id} ${u.name} ${u.email} ${u.role}`}
      searchPlaceholder="Tìm theo tên, mã, email…"
      filter={{
        label: 'Tất cả phân loại',
        options: ROLES.map((r) => [r, r]),
        test: (u, role) => u.role === role,
      }}
      csv={{
        filename: 'nguoi-dung.csv',
        header: ['Mã', 'Tên', 'Email', 'Vai trò', 'Trạng thái'],
        row: (u) => [u.id, u.name, u.email, u.role, u.active ? 'Hoạt động' : 'Ngừng hoạt động'],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <UserForm
          emails={items.filter((u) => u.id !== editing?.id).map((u) => u.email)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('ND', items.map((u) => u.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
