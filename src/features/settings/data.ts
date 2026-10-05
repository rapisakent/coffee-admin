/** One document at /api/settings — the shop's contact details. */
export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
}

export const CURRENCIES: [code: string, label: string][] = [['VND', 'VND — Việt Nam đồng']];
