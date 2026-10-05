import { CircleDollarSign } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { TRANSACTION_TYPE, totals, type Transaction, type TransactionType } from './data';
import { useTransactions } from './store';
import { TransactionForm } from './TransactionForm';

const columns: Column<Transaction>[] = [
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
    key: 'type',
    header: 'Phân loại / Trạng thái',
    cell: (t) => {
      const [label, tone] = TRANSACTION_TYPE[t.type];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'amount', header: 'Tổng tiền (đ)', cell: (t) => <Money tr={t.amount} /> },
  { key: 'method', header: 'Phương thức', cell: (t) => t.method },
  { key: 'date', header: 'Ngày', cell: (t) => <span className="mono">{fmtDate(t.date)}</span> },
];

export default function FinancePage() {
  const { items, status, error, reload } = useTransactions();
  const add = useTransactions((s) => s.add);
  const update = useTransactions((s) => s.update);
  const remove = useTransactions((s) => s.remove);

  return (
    <EntityListPage<Transaction>
      eyebrow="Tài chính"
      title="Thu / chi"
      lead="Sổ thu chi và phương thức thanh toán trong dữ liệu demo."
      noun="phiếu thu / chi"
      createLabel="Thêm phiếu thu / chi"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(t) => t.id}
      statsCols={3}
      stats={(list) => {
        const { income, expense, balance } = totals(list);
        return (
          <>
            <StatCard label="Tổng thu" value={<Money tr={income} />} icon={CircleDollarSign} />
            <StatCard label="Tổng chi" value={<Money tr={expense} />} icon={CircleDollarSign} />
            <StatCard label="Thu trừ chi" value={<Money tr={balance} />} icon={CircleDollarSign} />
          </>
        );
      }}
      searchText={(t) => `${t.id} ${t.title} ${t.method}`}
      searchPlaceholder="Tìm theo nội dung, mã, phương thức…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(TRANSACTION_TYPE).map(([value, [label]]) => [value, label]),
        test: (t, value) => t.type === (value as TransactionType),
      }}
      csv={{
        filename: 'thu-chi.csv',
        header: ['Mã', 'Nội dung', 'Loại', 'Số tiền (triệu đ)', 'Phương thức', 'Ngày'],
        row: (t) => [t.id, t.title, TRANSACTION_TYPE[t.type][0], t.amount, t.method, fmtDate(t.date)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <TransactionForm
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('TC', items.map((t) => t.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
