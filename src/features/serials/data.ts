import type { Tone } from '../../lib';

export type SerialStatus = 'awaitingInstall' | 'installed' | 'warranty' | 'repairing';

export interface Serial {
  id: string; // machine serial, e.g. LM-LPB-2026-00042
  productId: string; // SKU
  product: string;
  customerId: string;
  customer: string;
  status: SerialStatus;
}

export const SERIAL_STATUS: Record<SerialStatus, [label: string, tone: Tone]> = {
  awaitingInstall: ['Chờ lắp đặt', 'warn'],
  installed: ['Đã lắp đặt', 'info'],
  warranty: ['Bảo hành', 'success'],
  repairing: ['Đang sửa', 'danger'],
};

/** Needs someone to act: waiting for install or in the workshop. */
export const needsAction = (s: Serial) => s.status === 'awaitingInstall' || s.status === 'repairing';
