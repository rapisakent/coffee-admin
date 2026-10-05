import type { Tone } from '../../lib';

export type DebtKind = 'receivable' | 'payable';

export interface Debt {
  id: string; // CN-001
  party: string; // tên khách hàng hoặc nhà cung cấp
  kind: DebtKind;
  total: number; // triệu đồng
  paid: number; // triệu đồng, đã thanh toán
  due: string; // YYYY-MM-DD, hạn thanh toán
}

export const DEBT_KIND: Record<DebtKind, [label: string, tone: Tone]> = {
  receivable: ['Phải thu', 'success'],
  payable: ['Phải trả', 'warn'],
};

export const remaining = (d: Debt) => d.total - d.paid;

export const outstanding = (list: Debt[], kind: DebtKind) =>
  list.filter((d) => d.kind === kind).reduce((s, d) => s + remaining(d), 0);
