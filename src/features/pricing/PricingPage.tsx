import { Package, Tag, Users } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { nextCode } from '../../lib';
import { fmtDate } from '../../text';
import { useProducts } from '../products/store';
import { SEGMENT, type PriceEntry, type Segment } from './data';
import { PriceForm } from './PriceForm';
import { usePriceList } from './store';

const columns: Column<PriceEntry>[] = [
  {
    key: 'product',
    header: 'Tên',
    cell: (p) => (
      <div className="stack">
        <strong>{p.product}</strong>
        <small>{p.id}</small>
      </div>
    ),
  },
  { key: 'id', header: 'Mã / Serial', cell: (p) => <span className="mono">{p.id}</span> },
  {
    key: 'segment',
    header: 'Phân loại / Trạng thái',
    cell: (p) => {
      const [label, tone] = SEGMENT[p.segment];
      return <span className={`pill ${tone}`}>{label}</span>;
    },
  },
  { key: 'price', header: 'Giá bán (đ)', cell: (p) => <Money tr={p.price} /> },
  { key: 'from', header: 'Ngày', cell: (p) => <span className="mono">{fmtDate(p.from)}</span> },
  { key: 'to', header: 'Đến ngày', cell: (p) => <span className="mono">{fmtDate(p.to)}</span> },
];

export default function PricingPage() {
  const { items, status, error, reload } = usePriceList();
  const add = usePriceList((s) => s.add);
  const update = usePriceList((s) => s.update);
  const remove = usePriceList((s) => s.remove);
  const products = useProducts((s) => s.items);

  return (
    <EntityListPage<PriceEntry>
      eyebrow="Sản phẩm"
      title="Bảng giá"
      lead="Giá theo nhóm khách và thời gian áp dụng; không tự thay đổi giá sản phẩm."
      noun="mức giá"
      createLabel="Thêm mức giá"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(p) => p.id}
      statsCols={3}
      stats={(list) => (
        <>
          <StatCard label="Mức giá" value={list.length} icon={Tag} />
          <StatCard label="Nhóm khách" value={new Set(list.map((p) => p.segment)).size} icon={Users} />
          <StatCard label="Sản phẩm áp dụng" value={new Set(list.map((p) => p.productId)).size} icon={Package} />
        </>
      )}
      searchText={(p) => `${p.id} ${p.product} ${SEGMENT[p.segment][0]}`}
      searchPlaceholder="Tìm theo tên, mã…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(SEGMENT).map(([value, [label]]) => [value, label]),
        test: (p, segment) => p.segment === (segment as Segment),
      }}
      csv={{
        filename: 'bang-gia.csv',
        header: ['Mã', 'Sản phẩm', 'Nhóm khách', 'Giá bán (triệu đ)', 'Áp dụng từ', 'Đến ngày'],
        row: (p) => [p.id, p.product, SEGMENT[p.segment][0], p.price, fmtDate(p.from), fmtDate(p.to)],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <PriceForm
          products={products}
          onCancel={done}
          onSubmit={(values) => {
            if (editing) void update(editing.id, values);
            else void add({ ...values, id: nextCode('GIA', items.map((p) => p.id), 3) });
            done();
          }}
        />
      )}
    />
  );
}
