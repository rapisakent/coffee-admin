import type { Tone } from '../../lib';

export type TransactionType = 'in' | 'out';

export interface Transaction {
  id: string; // TC-001
  title: string;
  type: TransactionType;
  amount: number; // triệu đồng, luôn dương; chiều thu/chi nằm ở `type`
  method: string;
  date: string; // YYYY-MM-DD
}

export const TRANSACTION_TYPE: Record<TransactionType, [label: string, tone: Tone]> = {
  in: ['Thu', 'success'],
  out: ['Chi', 'warn'],
};

export const PAYMENT_METHODS = ['Chuyển khoản', 'Tiền mặt', 'Thẻ'];

export const totals = (list: Transaction[]) => {
  const sum = (type: TransactionType) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
  const income = sum('in');
  const expense = sum('out');
  return { income, expense, balance: income - expense };
};
