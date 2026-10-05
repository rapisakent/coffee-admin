import type { Tone } from '../../lib';

export type TicketStatus = 'new' | 'handling' | 'resolved';
export type Priority = 'high' | 'normal' | 'low';

export interface Ticket {
  id: string; // TK-001
  title: string;
  customerId: string;
  customer: string;
  priority: Priority;
  owner: string;
  date: string; // YYYY-MM-DD
  status: TicketStatus;
}

export const TICKET_STATUS: Record<TicketStatus, [label: string, tone: Tone]> = {
  new: ['Mới', 'success'],
  handling: ['Đang xử lý', 'info'],
  resolved: ['Đã xử lý', 'warn'],
};

export const PRIORITY_LABEL: Record<Priority, string> = { high: 'Cao', normal: 'Thường', low: 'Thấp' };
