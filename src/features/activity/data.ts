import type { Tone } from '../../lib';

export type ActivityAction = 'create' | 'update' | 'delete';

/** Written by the API on every create / update / delete; the UI only reads it. */
export interface ActivityEntry {
  id: string; // NK-0001
  at: string; // ISO timestamp
  module: string; // API collection name, see MODULE_LABEL
  action: ActivityAction;
  target: string; // id of the record that changed
  actor: string;
}

export const ACTION: Record<ActivityAction, [label: string, tone: Tone]> = {
  create: ['Thêm', 'success'],
  update: ['Sửa', 'info'],
  delete: ['Xóa', 'danger'],
};

export const MODULE_LABEL: Record<string, string> = {
  customers: 'Khách hàng',
  leads: 'Khách hàng tiềm năng',
  opportunities: 'Cơ hội bán hàng',
  quotes: 'Báo giá',
  orders: 'Đơn hàng',
  products: 'Sản phẩm',
  categories: 'Danh mục',
  'price-list': 'Bảng giá',
  'stock-movements': 'Nhập / xuất kho',
  stocktakes: 'Kiểm kho',
  serials: 'Serial máy',
  suppliers: 'Nhà cung cấp',
  purchases: 'Đơn mua hàng',
  installs: 'Lắp đặt',
  warranty: 'Bảo hành',
  maintenance: 'Bảo trì',
  tickets: 'Ticket hỗ trợ',
  transactions: 'Thu / chi',
  invoices: 'Hóa đơn',
  debts: 'Công nợ',
  users: 'Người dùng',
  settings: 'Cấu hình',
};

export const moduleLabel = (key: string) => MODULE_LABEL[key] ?? key;
