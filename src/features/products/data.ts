export type ProductGroup = 'espresso' | 'grinder' | 'beans' | 'accessory' | 'supply';

export interface Product {
  id: string; // SKU, e.g. MX-LM-GS3
  name: string;
  group: ProductGroup;
  cost: number;
  price: number;
  stock: number;
  unit: string;
  minStock: number;
  supplier: string;
}

export const GROUP_LABEL: Record<ProductGroup, string> = {
  espresso: 'Máy pha cà phê',
  grinder: 'Máy xay',
  beans: 'Hạt cà phê',
  accessory: 'Phụ kiện',
  supply: 'Vật tư tiêu hao',
};

/** Machines are tracked by serial number. */
export const isMachine = (p: Product) => p.group === 'espresso' || p.group === 'grinder';
export const isLowStock = (p: Product) => p.stock <= p.minStock;
