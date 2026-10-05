import { TriangleAlert } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { Money } from '../../components/ui';
import { GROUP_LABEL, isLowStock, type Product, type ProductGroup } from './data';
import { ProductForm } from './ProductForm';
import { productStats } from './ProductStats';
import { useProducts } from './store';
import { unique } from '../../text';

const columns: Column<Product>[] = [
  {
    key: 'name',
    header: 'Sản phẩm',
    cell: (p) => (
      <div className="stack">
        <strong>{p.name}</strong>
        <small>{p.id}</small>
      </div>
    ),
  },
  { key: 'group', header: 'Nhóm', cell: (p) => <span className="pill success">{GROUP_LABEL[p.group]}</span> },
  { key: 'cost', header: 'Giá vốn', cell: (p) => <Money tr={p.cost} /> },
  { key: 'price', header: 'Giá bán', cell: (p) => <strong><Money tr={p.price} /></strong> },
  {
    key: 'stock',
    header: 'Tồn kho',
    cell: (p) => (
      <span className={`stock ${isLowStock(p) ? 'low' : ''}`}>
        {isLowStock(p) && <TriangleAlert aria-label="Sắp hết hàng" />}
        {p.stock} {p.unit}
      </span>
    ),
  },
  { key: 'supplier', header: 'Nhà cung cấp', cell: (p) => p.supplier },
];

export default function ProductsPage() {
  const { items, status, error, reload } = useProducts();
  const add = useProducts((s) => s.add);
  const update = useProducts((s) => s.update);
  const remove = useProducts((s) => s.remove);

  return (
    <EntityListPage<Product>
      eyebrow="Sản phẩm"
      title="Danh mục sản phẩm"
      lead="Máy pha, máy xay, hạt cà phê, phụ kiện, vật tư và linh kiện."
      noun="sản phẩm"
      items={items}
      status={status}
      error={error}
      onReload={() => void reload()}
      columns={columns}
      rowKey={(p) => p.id}
      statsCols={4}
      stats={productStats}
      searchText={(p) => `${p.name} ${p.id} ${p.supplier}`}
      searchPlaceholder="Tìm theo tên, mã, nhà cung cấp…"
      filter={{
        label: 'Tất cả phân loại',
        options: Object.entries(GROUP_LABEL),
        test: (p, group) => p.group === (group as ProductGroup),
      }}
      csv={{
        filename: 'san-pham.csv',
        header: ['SKU', 'Tên', 'Nhóm', 'Giá vốn (triệu đồng)', 'Giá bán (triệu đồng)', 'Tồn kho', 'Đơn vị', 'Nhà cung cấp'],
        row: (p) => [p.id, p.name, GROUP_LABEL[p.group], p.cost, p.price, p.stock, p.unit, p.supplier],
      }}
      canEdit
      onRemove={(item) => void remove(item.id)}
      renderForm={(done, editing) => (
        <ProductForm
          existingIds={items.filter((p) => p.id !== editing?.id).map((p) => p.id)}
          suppliers={unique(items, (p) => p.supplier)}
          onCancel={done}
          onSubmit={(product) => {
            if (editing) void update(editing.id, product);
            else void add(product);
            done();
          }}
        />
      )}
    />
  );
}
