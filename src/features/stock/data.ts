export type MovementType = 'in' | 'out';

export interface StockMovement {
  id: string; // PK-0001
  productId: string; // SKU
  product: string;
  type: MovementType;
  qty: number;
  at: string; // ISO datetime
  note: string;
}

export const MOVEMENT_LABEL: Record<MovementType, string> = { in: 'Nhập kho', out: 'Xuất kho' };

// Figma shows this screen empty, so there is no seed.
