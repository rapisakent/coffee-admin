import { CircleDollarSign, Coffee, Package } from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Money } from '../../components/ui';
import { isLowStock, isMachine, type Product } from './data';

/** The four stat cards shared by the product catalogue and the inventory page. */
export function productStats(list: Product[]) {
  return (
    <>
      <StatCard label="Tổng sản phẩm" value={list.length} icon={Package} />
      <StatCard label="Tài sản (máy, quản lý serial)" value={list.filter(isMachine).length} icon={Coffee} />
      <StatCard label="Sắp hết hàng" value={list.filter(isLowStock).length} icon={Package} />
      <StatCard
        label="Giá trị tồn kho (giá vốn)"
        value={<Money tr={list.reduce((sum, p) => sum + p.cost * p.stock, 0)} />}
        icon={CircleDollarSign}
      />
    </>
  );
}
