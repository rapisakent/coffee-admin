// Shape of GET /api/dashboard (money in triệu đồng). The numbers live in mock/db.json.
import type { OrderStatus } from '../orders/data';

export interface MonthStat { month: number; revenue: number; orders: number }
export interface Share { name: string; value: number }
export interface ListItem { name: string; meta: string }
export interface RecentOrder { customer: string; code: string; status: OrderStatus }
export interface TopProduct { name: string; category: string; sold: number; revenue: number }
export interface UpcomingInstall { date: string; customer: string; machine: string }

export interface DashboardData {
  monthly: MonthStat[];
  newCustomers: { current: number; previous: number };
  revenueByGroup: Share[];
  lowStock: ListItem[];
  pendingInstalls: ListItem[];
  inRepair: ListItem[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  upcomingInstalls: UpcomingInstall[];
}
