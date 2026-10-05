import type { Tone } from '../../lib';

export type WarrantyStatus = 'inspecting' | 'repairing' | 'done';

export interface WarrantyTicket {
  id: string; // BH-001
  serial: string;
  customerId: string;
  customer: string;
  device: string;
  status: WarrantyStatus;
  owner: string;
}

export const WARRANTY_STATUS: Record<WarrantyStatus, [label: string, tone: Tone]> = {
  inspecting: ['Đang kiểm tra', 'info'],
  repairing: ['Đang sửa', 'danger'],
  done: ['Hoàn thành', 'success'],
};
