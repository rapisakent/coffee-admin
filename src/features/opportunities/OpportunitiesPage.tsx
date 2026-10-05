import { CircleDollarSign, Handshake, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { useCustomers } from '../customers/store';
import { isOpen, OPPORTUNITY_STATUS, type Opportunity, type OpportunityStatus } from './data';
import { OpportunityForm } from './OpportunityForm';
import { useOpportunities } from './store';

const columns: Column<Opportunity>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (o) => (
      <div className="stack">
        <strong>{o.name}</strong>
        <small>{o.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (o) => <span className="mono">{o.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (o) => {
      const [label, tone] = OPPORTUNITY_STATUS[o.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'customer', header: 'Khách hàng', cell: (o) => o.customer },
  { key: 'amount', header: 'Tổng tiền (đ)', cell: (o) => <Money tr={o.amount} /> },
  { key: 'probability', header: 'Xác suất (%)', cell: (o) => o.probability },
  { key: 'owner', header: 'Người phụ trách', cell: (o) => o.owner },
  { key: 'date', header: 'Ngày', cell: (o) => <span className="mono">{fmtDate(o.date)}</span> },
];

export default function OpportunitiesPage() {
  const { items, status, error, reload } = useOpportunities();
  const add = useOpportunities((s) => s.add);
  const update = useOpportunities((s) => s.update);
  const remove = useOpportunities((s) => s.remove);
  const customers = useCustomers((s) => s.items);

  return (
    <EntityListPage<Opportunity>
      eyebrow="CRM"
      title="Cơ hội bán hàng"
      lead="Giá trị cơ hội, xác suất thành công và ngày dự kiến chốt."
      noun="cơ hội"
      createLabel="Thêm cơ hội"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(o) => o.id}
      statsCols={3}
      stats={(list) => {
        const open = list.filter(isOpen);
        return (
          <>
            <StatCard label="Cơ hội đang mở" value={open.length} icon={Users} />
            <StatCard label="Giá trị đang mở" value={<Money tr={open.reduce((s, o) => s + o.amount, 0)} />} icon={CircleDollarSign} />
            <StatCard label="Giá trị kỳ vọng" value={<Money tr={open.reduce((s, o) => s + (o.amount * o.probability) / 100, 0)} />} icon={Handshake} />
          </>
        );
      }}
      searchText={(o) => `${o.id} ${o.name} ${o.customer} ${o.owner}`}
      searchPlaceholder="Tìm theo tên, mã, khách hàng…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(OPPORTUNITY_STATUS).map(([value, [label]]) => [value, label]),
        test: (o, status) => o.status === (status as OpportunityStatus),
      }}
      csv={{
        filename: 'co-hoi-ban-hang.csv',
        header: ['Mã', 'Tên', 'Trạng thái', 'Khách hàng', 'Tổng tiền (triệu đ)', 'Xác suất (%)', 'Người phụ trách', 'Ngày dự kiến chốt'],
        row: (o) => [o.id, o.name, OPPORTUNITY_STATUS[o.status][0], o.customer, o.amount, o.probability, o.owner, fmtDate(o.date)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <OpportunityForm
          customers={customers}
          owners={unique(items, (o) => o.owner)}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('CH', items.map((o) => o.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
