import { CircleCheck, ClipboardList, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { useCustomers } from '../customers/store';
import { PRIORITY_LABEL, TICKET_STATUS, type Ticket, type TicketStatus } from './data';
import { useTickets } from './store';
import { TicketForm } from './TicketForm';

const columns: Column<Ticket>[] = [
  {
    key: 'title',
    header: 'Tên',
    cell: (t) => (
      <div className="stack">
        <strong>{t.title}</strong>
        <small>{t.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (t) => <span className="mono">{t.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (t) => {
      const [label, tone] = TICKET_STATUS[t.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'customer', header: 'Khách hàng', cell: (t) => t.customer },
  { key: 'priority', header: 'Mức ưu tiên', cell: (t) => PRIORITY_LABEL[t.priority] },
  { key: 'owner', header: 'Người phụ trách', cell: (t) => t.owner },
  { key: 'date', header: 'Ngày', cell: (t) => <span className="mono">{fmtDate(t.date)}</span> },
];

export default function TicketsPage() {
  const { items, status, error, reload } = useTickets();
  const add = useTickets((s) => s.add);
  const update = useTickets((s) => s.update);
  const remove = useTickets((s) => s.remove);
  const customers = useCustomers((s) => s.items);

  return (
    <EntityListPage<Ticket>
      eyebrow="Kỹ thuật & hậu mãi"
      title="Ticket hỗ trợ"
      lead="Vấn đề khách hàng, mức ưu tiên và tiến độ xử lý."
      noun="ticket"
      createLabel="Tạo ticket"
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
          <StatCard label="Đang hoạt động / xử lý" value={list.filter((t) => t.status !== 'resolved').length} icon={Users} />
          <StatCard label="Hoàn tất / đủ điều kiện" value={list.filter((t) => t.status === 'resolved').length} icon={CircleCheck} />
        </>
      )}
      searchText={(t) => `${t.id} ${t.title} ${t.customer} ${t.owner}`}
      searchPlaceholder="Tìm theo tên, mã, khách hàng…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(TICKET_STATUS).map(([value, [label]]) => [value, label]),
        test: (t, value) => t.status === (value as TicketStatus),
      }}
      csv={{
        filename: 'ticket-ho-tro.csv',
        header: ['Mã', 'Vấn đề', 'Trạng thái', 'Khách hàng', 'Mức ưu tiên', 'Người phụ trách', 'Ngày'],
        row: (t) => [t.id, t.title, TICKET_STATUS[t.status][0], t.customer, PRIORITY_LABEL[t.priority], t.owner, fmtDate(t.date)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <TicketForm
          customers={customers}
          owners={unique(items, (t) => t.owner)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('TK', items.map((t) => t.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
