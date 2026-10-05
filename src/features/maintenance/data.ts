import type { Tone } from '../../lib';

export type MaintenanceStatus = 'scheduled' | 'awaiting' | 'done';

export interface Maintenance {
  id: string; // BT-001
  customerId: string;
  customer: string;
  device: string;
  date: string; // YYYY-MM-DD
  tech: string;
  status: MaintenanceStatus;
}

export const MAINTENANCE_STATUS: Record<MaintenanceStatus, [label: string, tone: Tone]> = {
  scheduled: ['Đã lên lịch', 'success'],
  awaiting: ['Chờ xác nhận', 'warn'],
  done: ['Hoàn thành', 'info'],
};
