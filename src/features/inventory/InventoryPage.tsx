import { TriangleAlert } from 'lucide-react';
import type { Column } from '../../components/DataTable';
import { EntityListPage } from '../../components/EntityListPage';
import { GROUP_LABEL, isLowStock, type Product, type ProductGroup } from '../products/data';
import { productStats } from '../products/ProductStats';
import { useProducts } from '../products/store';

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
  { key: 'sku', header: 'SKU', cell: (p) => <span className="mono">{p.id}</span> },
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
  { key: 'min', header: 'Tồn tối thiểu', cell: (p) => p.minStock },
  { key: 'group', header: 'Nhóm', cell: (p) => <span className="pill success">{GROUP_LABEL[p.group]}</span> },
  { key: 'supplier', header: 'Nhà cung cấp', cell: (p) => p.supplier },
];

// The stock levels live on the product itself; this page is a stock-focused view of the same store.
export default function InventoryPage() {
  const { items, status, error, reload } = useProducts();

  return (
    <EntityListPage<Product>
      eyebrow="Kho"
      title="Tồn kho"
      lead="Theo dõi số lượng tồn kho và ngưỡng cảnh báo cho từng sản phẩm."
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
        filename: 'ton-kho.csv',
        header: ['SKU', 'Tên', 'Nhóm', 'Tồn kho', 'Đơn vị', 'Tồn tối thiểu', 'Nhà cung cấp'],
        row: (p) => [p.id, p.name, GROUP_LABEL[p.group], p.stock, p.unit, p.minStock, p.supplier],
      }}
      primary={{ label: 'Nhập / xuất kho', to: '/nhap-xuat-kho' }}
    />
  );
}
