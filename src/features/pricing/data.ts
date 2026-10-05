import type { Tone } from '../../lib';

export type Segment = 'retail' | 'dealer' | 'business';

export interface PriceEntry {
  id: string; // GIA-001
  productId: string;
  product: string;
  segment: Segment;
  price: number; // triệu đồng
  from: string; // YYYY-MM-DD, áp dụng từ ngày
  to: string; // YYYY-MM-DD, đến ngày
}

export const SEGMENT: Record<Segment, [label: string, tone: Tone]> = {
  retail: ['Bán lẻ', 'success'],
  dealer: ['Đại lý', 'info'],
  business: ['Doanh nghiệp', 'warn'],
};
