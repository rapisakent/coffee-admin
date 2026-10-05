import { CalendarDays, Package, Pencil } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { fmtDateTime } from '../../text';
import { ACTION, moduleLabel, type ActivityAction, type ActivityEntry } from './data';
import { useActivity } from './store';

const columns: Column<ActivityEntry>[] = [
  { key: 'at', header: 'Ngày', cell: (a) => <span className="mono">{fmtDateTime(a.at)}</span> },
  {
    key: 'title',
    header: 'Tên',
    cell: (a) => (
      <div className="stack">
        <strong>{ACTION[a.action][0]} {a.target}</strong>
        <small>{a.id}</small>
      </div>
    ),
  },
  { key: 'module', header: 'Phân hệ', cell: (a) => moduleLabel(a.module) },
  {
    key: 'action',
    header: 'Phân loại / Trạng thái',
    cell: (a) => {
      const [label, tone] = ACTION[a.action];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'actor', header: 'Người thực hiện', cell: (a) => a.actor },
];

export default function ActivityPage() {
  const { items, status, error, reload } = useActivity();

  return (
    <EntityListPage<ActivityEntry>
      eyebrow="Hệ thống"
      title="Nhật ký hoạt động"
      lead="Lịch sử thêm, sửa và xóa dữ liệu, ghi nhận bởi API."
      noun="thao tác"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(a) => a.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Thao tác ghi nhận" value={list.length} icon={CalendarDays} />
          <StatCard label="Phân hệ có hoạt động" value={new Set(list.map((a) => a.module)).size} icon={Package} />
          <StatCard label="Thêm / sửa" value={list.filter((a) => a.action !== 'delete').length} icon={Pencil} />
        </>
      )}
      searchText={(a) => `${a.id} ${a.target} ${moduleLabel(a.module)} ${a.actor}`}
      searchPlaceholder="Tìm theo mã, phân hệ, người thực hiện…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(ACTION).map(([value, [label]]) => [value, label]),
        test: (a, value) => a.action === (value as ActivityAction),
      }}
      csv={{
        filename: 'nhat-ky-hoat-dong.csv',
        header: ['Mã', 'Thời gian', 'Phân hệ', 'Thao tác', 'Đối tượng', 'Người thực hiện'],
        row: (a) => [a.id, fmtDateTime(a.at), moduleLabel(a.module), ACTION[a.action][0], a.target, a.actor],
      }}
    />
  );
}
