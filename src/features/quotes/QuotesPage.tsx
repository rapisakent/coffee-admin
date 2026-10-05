import { CircleDollarSign, FileText, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useCustomers } from '../customers/store';
import { QUOTE_STATUS, type Quote, type QuoteStatus } from './data';
import { QuoteForm } from './QuoteForm';
import { useQuotes } from './store';

const columns: Column<Quote>[] = [
  {
    key: 'name',
    header: 'Tên',
    cell: (q) => (
      <div className="stack">
        <strong>{q.name}</strong>
        <small>{q.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (q) => <span className="mono">{q.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (q) => {
      const [label, tone] = QUOTE_STATUS[q.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'customer', header: 'Khách hàng', cell: (q) => q.customer },
  { key: 'amount', header: 'Tổng tiền (đ)', cell: (q) => <Money tr={q.amount} /> },
  { key: 'date', header: 'Ngày', cell: (q) => <span className="mono">{fmtDate(q.validUntil)}</span> },
];

export default function QuotesPage() {
  const { items, status, error, reload } = useQuotes();
  const add = useQuotes((s) => s.add);
  const update = useQuotes((s) => s.update);
  const remove = useQuotes((s) => s.remove);
  const customers = useCustomers((s) => s.items);

  return (
    <EntityListPage<Quote>
      eyebrow="CRM"
      title="Báo giá"
      lead="Báo giá gửi khách và thời hạn hiệu lực."
      noun="báo giá"
      createLabel="Tạo báo giá"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(q) => q.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={FileText} />
          <StatCard label="Tổng giá trị" value={<Money tr={list.reduce((s, q) => s + q.amount, 0)} />} icon={CircleDollarSign} />
          <StatCard label="Chờ xử lý" value={list.filter((q) => q.status === 'sent').length} icon={Wrench} />
        </>
      )}
      searchText={(q) => `${q.id} ${q.name} ${q.customer}`}
      searchPlaceholder="Tìm theo tên, mã, khách hàng…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(QUOTE_STATUS).map(([value, [label]]) => [value, label]),
        test: (q, status) => q.status === (status as QuoteStatus),
      }}
      csv={{
        filename: 'bao-gia.csv',
        header: ['Mã', 'Tên', 'Trạng thái', 'Khách hàng', 'Tổng tiền (triệu đ)', 'Hiệu lực đến'],
        row: (q) => [q.id, q.name, QUOTE_STATUS[q.status][0], q.customer, q.amount, fmtDate(q.validUntil)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <QuoteForm
          customers={customers}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('BG', items.map((q) => q.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
