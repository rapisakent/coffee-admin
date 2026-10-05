import type { Tone } from '../../lib';

export type OpportunityStatus = 'consulting' | 'negotiating' | 'won' | 'lost';

export interface Opportunity {
  id: string; // CH-001
  name: string;
  customerId: string;
  customer: string;
  amount: number; // triệu đồng
  probability: number; // 0-100
  owner: string;
  date: string; // YYYY-MM-DD, ngày dự kiến chốt
  status: OpportunityStatus;
}

export const OPPORTUNITY_STATUS: Record<OpportunityStatus, [label: string, tone: Tone]> = {
  consulting: ['Đang tư vấn', 'info'],
  negotiating: ['Đàm phán', 'success'],
  won: ['Thắng', 'success'],
  lost: ['Thua', 'danger'],
};

export const isOpen = (o: Opportunity) => o.status === 'consulting' || o.status === 'negotiating';
