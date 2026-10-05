export type CustomerType = 'business' | 'individual';

export interface Customer {
  id: string; // KH-0001
  name: string;
  type: CustomerType;
  phone: string;
  email: string;
  region: string;
  machines: number;
  spend: number;
  owner: string;
}

export const TYPE_LABEL: Record<CustomerType, string> = { business: 'Doanh nghiệp', individual: 'Cá nhân' };
