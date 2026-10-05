import type { Tone } from '../../lib';

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'awaitingInstall' | 'cancelled' | 'completed';

export interface Order {
  id: string; // DH-2026-0032
  customerId: string; // KH-0006
  customer: string;
  date: string; // YYYY-MM-DD
  total: number;
  status: OrderStatus;
}

export const ORDER_STATUS: Record<OrderStatus, [label: string, tone: Tone]> = {
  pending: ['Chờ xác nhận', 'warn'],
  processing: ['Đang xử lý', 'info'],
  shipping: ['Đang giao', 'info'],
  awaitingInstall: ['Chờ lắp đặt', 'warn'],
  cancelled: ['Đã hủy', 'danger'],
  completed: ['Hoàn thành', 'success'],
};

/** Orders still being worked on. */
export const isActive = (o: Order) => o.status !== 'cancelled' && o.status !== 'completed';
