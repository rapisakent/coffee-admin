import {
  ArrowRight, ChartColumn, CircleDollarSign, Coffee, History, LayoutGrid, Landmark, LifeBuoy, Package, Receipt, Settings, ShieldCheck, ShoppingCart, User, UserCog, Users, Wallet, Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  /** Lazy page module. Omit until the page is built — the route shows ComingSoon. */
  page?: () => Promise<{ default: ComponentType }>;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// To add a page: create src/features/<name>/<Name>Page.tsx (default export) and set `page` below.
export const NAV: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [{ path: '/', label: 'Dashboard', icon: LayoutGrid, page: () => import('./features/dashboard/DashboardPage') }],
  },
  {
    label: 'CRM',
    items: [
      { path: '/khach-hang', label: 'Khách hàng', icon: Users, page: () => import('./features/customers/CustomersPage') },
      { path: '/khach-hang-tiem-nang', label: 'Khách hàng tiềm năng', icon: Users, page: () => import('./features/leads/LeadsPage') },
      { path: '/co-hoi-ban-hang', label: 'Cơ hội bán hàng', icon: ArrowRight, page: () => import('./features/opportunities/OpportunitiesPage') },
      { path: '/bao-gia', label: 'Báo giá', icon: Package, page: () => import('./features/quotes/QuotesPage') },
    ],
  },
  {
    label: 'Bán hàng',
    items: [
      { path: '/don-hang', label: 'Đơn hàng', icon: ShoppingCart, page: () => import('./features/orders/OrdersPage') },
      { path: '/doi-tra', label: 'Đổi trả / hoàn tiền', icon: ArrowRight },
    ],
  },
  {
    label: 'Sản phẩm',
    items: [
      { path: '/san-pham', label: 'Sản phẩm', icon: Coffee, page: () => import('./features/products/ProductsPage') },
      { path: '/danh-muc', label: 'Danh mục', icon: Package, page: () => import('./features/categories/CategoriesPage') },
      { path: '/bang-gia', label: 'Bảng giá', icon: CircleDollarSign, page: () => import('./features/pricing/PricingPage') },
    ],
  },
  {
    label: 'Kho',
    items: [
      { path: '/ton-kho', label: 'Tồn kho', icon: Package, page: () => import('./features/inventory/InventoryPage') },
      { path: '/nhap-xuat-kho', label: 'Nhập / xuất kho', icon: ArrowRight, page: () => import('./features/stock/StockMovementsPage') },
      { path: '/serial-may', label: 'Serial máy', icon: Package, page: () => import('./features/serials/SerialsPage') },
      { path: '/kiem-kho', label: 'Kiểm kho', icon: Package, page: () => import('./features/stocktake/StocktakePage') },
    ],
  },
  {
    label: 'Mua hàng',
    items: [
      { path: '/nha-cung-cap', label: 'Nhà cung cấp', icon: Users, page: () => import('./features/suppliers/SuppliersPage') },
      { path: '/don-mua-hang', label: 'Đơn mua hàng', icon: ShoppingCart, page: () => import('./features/purchases/PurchasesPage') },
    ],
  },
  {
    label: 'Kỹ thuật & hậu mãi',
    items: [
      { path: '/lap-dat', label: 'Lắp đặt', icon: Wrench, page: () => import('./features/installs/InstallsPage') },
      { path: '/bao-hanh', label: 'Bảo hành', icon: ShieldCheck, page: () => import('./features/warranty/WarrantyPage') },
      { path: '/bao-tri', label: 'Bảo trì', icon: Wrench, page: () => import('./features/maintenance/MaintenancePage') },
      { path: '/ticket-ho-tro', label: 'Ticket hỗ trợ', icon: LifeBuoy, page: () => import('./features/tickets/TicketsPage') },
    ],
  },
  {
    label: 'Tài chính',
    items: [
      { path: '/thu-chi', label: 'Thu / chi', icon: Wallet, page: () => import('./features/finance/FinancePage') },
      { path: '/hoa-don', label: 'Hóa đơn', icon: Receipt, page: () => import('./features/invoices/InvoicesPage') },
      { path: '/cong-no', label: 'Công nợ', icon: Landmark, page: () => import('./features/debts/DebtsPage') },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { path: '/bao-cao', label: 'Báo cáo', icon: ChartColumn, page: () => import('./features/reports/ReportsPage') },
      { path: '/nhat-ky', label: 'Nhật ký hoạt động', icon: History, page: () => import('./features/activity/ActivityPage') },
      { path: '/nguoi-dung', label: 'Người dùng & phân quyền', icon: UserCog, page: () => import('./features/users/UsersPage') },
    ],
  },
];

export const NAV_ITEMS = NAV.flatMap((g) => g.items);

// Reachable from the account menu, not listed in the sidebar.
export const ACCOUNT_ITEMS: NavItem[] = [
  { path: '/ho-so', label: 'Hồ sơ cá nhân', icon: User },
  { path: '/cai-dat', label: 'Cấu hình', icon: Settings, page: () => import('./features/settings/SettingsPage') },
];

export const findNav = (pathname: string) => [...NAV_ITEMS, ...ACCOUNT_ITEMS].find((i) => i.path === pathname);
