import { ArrowDownToLine, ArrowUpFromLine, ClipboardList } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { nextCode } from '../../lib';
import { fmtDateTime } from '../../text';
import { useProducts } from '../products/store';
import { MOVEMENT_LABEL, type MovementType, type StockMovement } from './data';
import { MovementForm } from './MovementForm';
import { recordMovement, useStockMovements } from './store';

const columns: Column<StockMovement>[] = [
  {
    key: 'product',
    header: 'Sản phẩm',
    cell: (m) => (
      <div className="stack">
        <strong>{m.product}</strong>
        <small>{m.productId}</small>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Loại phiếu',
    cell: (m) => <span className={`pill ${m.type === 'in' ? 'success' : 'warn'}`}>{MOVEMENT_LABEL[m.type]}</span>,
  },
  { key: 'qty', header: 'Số lượng', cell: (m) => <strong className="mono">{m.type === 'in' ? '+' : '−'}{m.qty}</strong> },
  { key: 'at', header: 'Thời gian', cell: (m) => fmtDateTime(m.at) },
  { key: 'note', header: 'Ghi chú', cell: (m) => m.note || '—' },
];

export default function StockMovementsPage() {
  const { items, status, error, reload } = useStockMovements();
  const products = useProducts((s) => s.items);

  return (
    <EntityListPage<StockMovement>
      eyebrow="Kho"
      title="Nhập / xuất kho"
      lead="Lịch sử điều chỉnh số lượng hàng hóa trong kho."
      noun="phiếu kho"
      createLabel="Tạo phiếu kho"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(m) => m.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Tổng bản ghi" value={list.length} icon={ClipboardList} />
          <StatCard label="Phiếu nhập" value={list.filter((m) => m.type === 'in').length} icon={ArrowDownToLine} />
          <StatCard label="Phiếu xuất" value={list.filter((m) => m.type === 'out').length} icon={ArrowUpFromLine} />
        </>
      )}
      searchText={(m) => `${m.product} ${m.productId} ${m.note}`}
      searchPlaceholder="Tìm theo sản phẩm, ghi chú…"
      filter={{
        label: 'Tất cả loại phiếu',
        options: Object.entries(MOVEMENT_LABEL),
        test: (m, type) => m.type === (type as MovementType),
      }}
      csv={{
        filename: 'nhap-xuat-kho.csv',
        header: ['Mã phiếu', 'SKU', 'Sản phẩm', 'Loại phiếu', 'Số lượng', 'Thời gian', 'Ghi chú'],
        row: (m) => [m.id, m.productId, m.product, MOVEMENT_LABEL[m.type], m.qty, fmtDateTime(m.at), m.note],
      }}
      renderForm={(done) => (
        <MovementForm
          products={products}
          onCancel={done}
          onSubmit={(values) => {
            const error = recordMovement(values, nextCode('PK', items.map((m) => m.id)));
            if (!error) done();
            return error;
          }}
        />
      )}
    />
  );
}
