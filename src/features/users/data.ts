// Named AppUser to avoid clashing with the lucide `User` icon used by the account menu.
export interface AppUser {
  id: string; // ND-001
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export const ROLES = ['Quản trị viên', 'Kinh doanh', 'Kỹ thuật', 'Kho', 'Kế toán'];
