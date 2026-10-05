import type { Tone } from '../../lib';

export type CategoryStatus = 'active' | 'inactive';

export interface Category {
  id: string; // DM-001
  name: string;
  status: CategoryStatus;
}

export const CATEGORY_STATUS: Record<CategoryStatus, [label: string, tone: Tone]> = {
  active: ['Hoạt động', 'success'],
  inactive: ['Ngừng dùng', 'warn'],
};
