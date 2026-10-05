import type { Tone } from '../../lib';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Quote {
  id: string; // BG-001
  name: string;
  customerId: string;
  customer: string;
  amount: number; // triệu đồng
  validUntil: string; // YYYY-MM-DD, hạn hiệu lực
  status: QuoteStatus;
}

export const QUOTE_STATUS: Record<QuoteStatus, [label: string, tone: Tone]> = {
  draft: ['Nháp', 'warn'],
  sent: ['Đã gửi', 'info'],
  accepted: ['Chấp nhận', 'success'],
  rejected: ['Từ chối', 'danger'],
};
