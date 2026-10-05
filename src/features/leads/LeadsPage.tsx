import { ClipboardList, UserCheck, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { LEAD_STATUS, type Lead, type LeadStatus } from './data';
import { LeadForm } from './LeadForm';
import { useLeads } from './store';

const columns: Column<Lead>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (l) => (
      <div className="stack">
        <strong>{l.name}</strong>
        <small>{l.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (l) => <span className="mono">{l.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (l) => {
      const [label, tone] = LEAD_STATUS[l.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  {
    key: 'contact',
    header: 'Số điện thoại',
    cell: (l) => (
      <div className="stack">
        <span>{l.phone}</span>
        <small>{l.email}</small>
      </div>
    ),
  },
  { key: 'source', header: 'Nguồn tiếp cận', cell: (l) => l.source },
  { key: 'owner', header: 'Người phụ trách', cell: (l) => l.owner },
  { key: 'date', header: 'Ngày', cell: (l) => <span className="mono">{fmtDate(l.date)}</span> },
];

export default function LeadsPage() {
  const { items, status, error, reload } = useLeads();
  const add = useLeads((s) => s.add);
  const update = useLeads((s) => s.update);
  const remove = useLeads((s) => s.remove);

  return (
    <EntityListPage<Lead>
      eyebrow="CRM"
      title="Khách hàng tiềm năng"
      lead="Theo dõi nguồn tiếp cận, người phụ trách và lịch liên hệ."
      noun="khách hàng tiềm năng"
      createLabel="Thêm khách hàng tiềm năng"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(l) => l.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((l) => l.status === 'new' || l.status === 'consulting').length} icon={Users} />
          <StatCard label="Hoàn tất / đủ điều kiện" value={list.filter((l) => l.status === 'qualified').length} icon={UserCheck} />
        </>
      )}
      searchText={(l) => `${l.id} ${l.name} ${l.phone} ${l.email} ${l.source} ${l.owner}`}
      searchPlaceholder="Tìm theo tên, mã, SĐT, email…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(LEAD_STATUS).map(([value, [label]]) => [value, label]),
        test: (l, status) => l.status === (status as LeadStatus),
      }}
      csv={{
        filename: 'khach-hang-tiem-nang.csv',
        header: ['Mã', 'Tên', 'Trạng thái', 'Số điện thoại', 'Email', 'Nguồn tiếp cận', 'Người phụ trách', 'Ngày liên hệ'],
        row: (l) => [l.id, l.name, LEAD_STATUS[l.status][0], l.phone, l.email, l.source, l.owner, fmtDate(l.date)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <LeadForm
          owners={unique(items, (l) => l.owner)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('TN', items.map((l) => l.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
