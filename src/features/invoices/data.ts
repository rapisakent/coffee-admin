import type { Tone } from '../../lib';

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid';

export interface Invoice {
  id: string; // HD-001
  orderId: string; // DH-2026-0028
  customerId: string;
  customer: string;
  amount: number; // triệu đồng
  date: string; // YYYY-MM-DD
  status: InvoiceStatus;
}

export const INVOICE_STATUS: Record<InvoiceStatus, [label: string, tone: Tone]> = {
  unpaid: ['Chờ thanh toán', 'warn'],
  partial: ['Đã thanh toán một phần', 'success'],
  paid: ['Đã thanh toán', 'info'],
};
