import type { Tone } from '../../lib';

export type StocktakeStatus = 'pending' | 'approved';

export interface Stocktake {
  id: string; // KK-001
  productId: string;
  product: string;
  status: StocktakeStatus;
  book: number; // tồn sổ sách tại thời điểm kiểm
  counted: number; // thực đếm
  date: string; // YYYY-MM-DD
  owner: string;
}

export const STOCKTAKE_STATUS: Record<StocktakeStatus, [label: string, tone: Tone]> = {
  pending: ['Chờ duyệt', 'warn'],
  approved: ['Đã duyệt', 'success'],
};

export const difference = (s: Stocktake) => s.counted - s.book;
