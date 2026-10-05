import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';
import { useProducts } from '../products/store';
import type { StockMovement } from './data';

export const useStockMovements = createEntityStore(api.stockMovements);

/**
 * Record a movement and move the product's stock in one step.
 * Returns an error message instead of throwing so the form can show it.
 */
export function recordMovement(m: Omit<StockMovement, 'id' | 'at'>, id: string): string | null {
  const { items, update } = useProducts.getState();
  const product = items.find((p) => p.id === m.productId);
  if (!product) return 'Không tìm thấy sản phẩm.';
  const next = product.stock + (m.type === 'in' ? m.qty : -m.qty);
  if (next < 0) return `Chỉ còn ${product.stock} ${product.unit} trong kho.`;

  void update(product.id, { stock: next });
  void useStockMovements.getState().add({ ...m, id, at: new Date().toISOString() });
  return null;
}
