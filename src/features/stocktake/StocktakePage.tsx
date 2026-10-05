import { ClipboardCheck, ClipboardList, Wrench } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDate, unique } from '../../text';
import { useProducts } from '../products/store';
import { difference, STOCKTAKE_STATUS, type Stocktake, type StocktakeStatus } from './data';
import { useStocktakes } from './store';
import { StocktakeForm } from './StocktakeForm';

const columns: Column<Stocktake>[] = [
  {
    key: 'product',
    header: 'Tên',
    cell: (s) => (
      <div className="stack">
        <strong>{s.product}</strong>
        <small>{s.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (s) => <span className="mono">{s.id}</span> },
  {
    key: 'status',
    header: 'Phân loại / Trạng thái',
    cell: (s) => {
      const [label, tone] = STOCKTAKE_STATUS[s.status];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'book', header: 'Tồn sổ sách', cell: (s) => s.book },
  { key: 'counted', header: 'Thực đếm', cell: (s) => s.counted },
  { key: 'diff', header: 'Chênh lệch', cell: (s) => difference(s) },
  { key: 'date', header: 'Ngày', cell: (s) => <span className="mono">{fmtDate(s.date)}</span> },
  { key: 'owner', header: 'Người phụ trách', cell: (s) => s.owner },
];

export default function StocktakePage() {
  const { items, status, error, reload } = useStocktakes();
  const add = useStocktakes((s) => s.add);
  const remove = useStocktakes((s) => s.remove);
  const products = useProducts((s) => s.items);

  return (
    <EntityListPage<Stocktake>
      eyebrow="Kho"
      title="Kiểm kho"
      lead="Kết quả kiểm đếm và chênh lệch; dùng Nhập / xuất kho để điều chỉnh tồn."
      noun="phiếu kiểm kho"
      createLabel="Tạo phiếu kiểm kho"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      onRemove={(item) => void remove(item.id)}
      columns={columns}
      rowKey={(s) => s.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Phiếu kiểm kho" value={list.length} icon={ClipboardList} />
          <StatCard label="Có chênh lệch" value={list.filter((s) => difference(s) !== 0).length} icon={ClipboardCheck} />
          <StatCard label="Chờ duyệt" value={list.filter((s) => s.status === 'pending').length} icon={Wrench} />
        </>
      )}
      searchText={(s) => `${s.id} ${s.product} ${s.owner}`}
      searchPlaceholder="Tìm theo tên, mã, người phụ trách…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(STOCKTAKE_STATUS).map(([value, [label]]) => [value, label]),
        test: (s, value) => s.status === (value as StocktakeStatus),
      }}
      csv={{
        filename: 'kiem-kho.csv',
        header: ['Mã', 'Sản phẩm', 'Trạng thái', 'Tồn sổ sách', 'Thực đếm', 'Chênh lệch', 'Ngày', 'Người phụ trách'],
        row: (s) => [s.id, s.product, STOCKTAKE_STATUS[s.status][0], s.book, s.counted, difference(s), fmtDate(s.date), s.owner],
      }}
      renderForm={(done) => (
        <StocktakeForm
          products={products}
          owners={unique(items, (s) => s.owner)}
          onCancel={done}
          onSubmit={(values) => {
            void add({ ...values, id: nextCode('KK', items.map((s) => s.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
