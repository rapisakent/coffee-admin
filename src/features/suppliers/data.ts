export interface Supplier {
  id: string; // NCC-001
  name: string;
  category: string; // tên danh mục sản phẩm cung cấp
  phone: string;
  email: string;
  region: string;
  terms: string; // điều khoản thanh toán
  active: boolean;
}

export const PAYMENT_TERMS = ['Thanh toán ngay', '15 ngày', '30 ngày', '45 ngày'];
