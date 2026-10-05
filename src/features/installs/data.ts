import type { Tone } from '../../lib';

export type InstallStatus = 'scheduled' | 'installing' | 'done';

export interface Install {
  id: string; // LD-001
  customerId: string;
  customer: string;
  device: string;
  date: string; // YYYY-MM-DD
  tech: string;
  status: InstallStatus;
}

export const INSTALL_STATUS: Record<InstallStatus, [label: string, tone: Tone]> = {
  scheduled: ['Chờ lắp đặt', 'warn'],
  installing: ['Đang lắp đặt', 'info'],
  done: ['Hoàn thành', 'success'],
};
