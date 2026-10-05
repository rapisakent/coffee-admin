import type { Tone } from '../../lib';

export type PurchaseStatus = 'pending' | 'ordered' | 'received';

export interface Purchase {
  id: string; // MH-001
  name: string;
  supplierId: string;
  supplier: string;
  amount: number; // triệu đồng
  date: string; // YYYY-MM-DD, ngày giao dự kiến
  status: PurchaseStatus;
}

export const PURCHASE_STATUS: Record<PurchaseStatus, [label: string, tone: Tone]> = {
  pending: ['Chờ duyệt', 'warn'],
  ordered: ['Đã đặt', 'success'],
  received: ['Đã nhận', 'info'],
};
