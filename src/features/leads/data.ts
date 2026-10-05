import type { Tone } from '../../lib';

export type LeadStatus = 'new' | 'consulting' | 'qualified' | 'lost';

export interface Lead {
  id: string; // TN-001
  name: string;
  phone: string;
  email: string;
  source: string;
  owner: string;
  date: string; // YYYY-MM-DD, ngày liên hệ
  status: LeadStatus;
}

export const LEAD_STATUS: Record<LeadStatus, [label: string, tone: Tone]> = {
  new: ['Mới', 'success'],
  consulting: ['Đang tư vấn', 'info'],
  qualified: ['Đủ điều kiện', 'success'],
  lost: ['Không phù hợp', 'danger'],
};

export const LEAD_SOURCES = ['Website', 'Giới thiệu', 'Mạng xã hội', 'Triển lãm', 'Trực tiếp'];
