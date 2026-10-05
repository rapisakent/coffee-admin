/**
 * Every endpoint the UI uses is declared here — add a resource by adding a line to `api`
 * (and its collection to mock/db.json while the mock API is in use).
 *
 *   mock/db.json          data      server/mockApi.ts   mock REST server (dev + preview)
 *   src/api/http.ts       axios     src/api/index.ts    endpoints (this file)
 *   src/stores/createEntityStore.ts   list state (load / add / update / remove) per collection
 */
import type { ActivityEntry } from '../features/activity/data';
import type { Category } from '../features/categories/data';
import type { Customer } from '../features/customers/data';
import type { DashboardData } from '../features/dashboard/data';
import type { Debt } from '../features/debts/data';
import type { AppUser } from '../features/users/data';
import type { Transaction } from '../features/finance/data';
import type { Install } from '../features/installs/data';
import type { Invoice } from '../features/invoices/data';
import type { Lead } from '../features/leads/data';
import type { Maintenance } from '../features/maintenance/data';
import type { Opportunity } from '../features/opportunities/data';
import type { Order } from '../features/orders/data';
import type { PriceEntry } from '../features/pricing/data';
import type { Product } from '../features/products/data';
import type { Purchase } from '../features/purchases/data';
import type { Quote } from '../features/quotes/data';
import type { Serial } from '../features/serials/data';
import type { Stocktake } from '../features/stocktake/data';
import type { Supplier } from '../features/suppliers/data';
import type { StockMovement } from '../features/stock/data';
import type { Ticket } from '../features/tickets/data';
import type { WarrantyTicket } from '../features/warranty/data';
import type { StoreSettings } from '../features/settings/data';
import { http } from './http';

export interface Collection<T extends { id: string }> {
  list: () => Promise<T[]>;
  create: (item: T) => Promise<T>;
  update: (id: string, patch: Partial<Omit<T, 'id'>>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

const collections: string[] = [];

const collection = <T extends { id: string }>(name: string): Collection<T> => {
  collections.push(name);
  return {
    list: () => http('GET', `/${name}`),
    create: (item) => http('POST', `/${name}`, item),
    update: (id, patch) => http('PATCH', `/${name}/${encodeURIComponent(id)}`, patch),
    remove: (id) => http('DELETE', `/${name}/${encodeURIComponent(id)}`),
  };
};

export const api = {
  customers: collection<Customer>('customers'),
  leads: collection<Lead>('leads'),
  opportunities: collection<Opportunity>('opportunities'),
  quotes: collection<Quote>('quotes'),
  orders: collection<Order>('orders'),
  products: collection<Product>('products'),
  categories: collection<Category>('categories'),
  priceList: collection<PriceEntry>('price-list'),
  stocktakes: collection<Stocktake>('stocktakes'),
  purchases: collection<Purchase>('purchases'),
  suppliers: collection<Supplier>('suppliers'),
  stockMovements: collection<StockMovement>('stock-movements'),
  serials: collection<Serial>('serials'),
  installs: collection<Install>('installs'),
  maintenance: collection<Maintenance>('maintenance'),
  tickets: collection<Ticket>('tickets'),
  activity: collection<ActivityEntry>('activity'),
  users: collection<AppUser>('users'),
  invoices: collection<Invoice>('invoices'),
  debts: collection<Debt>('debts'),
  transactions: collection<Transaction>('transactions'),
  warranty: collection<WarrantyTicket>('warranty'),
  dashboard: { get: () => http<DashboardData>('GET', '/dashboard') },
  settings: {
    get: () => http<StoreSettings>('GET', '/settings'),
    save: (values: StoreSettings) => http<StoreSettings>('PUT', '/settings', values),
  },
  /** Every collection plus the documents, for the "Tải bản sao dữ liệu" download. */
  backup: async (): Promise<Record<string, unknown>> => {
    const names = [...collections, 'dashboard', 'settings'];
    const data = await Promise.all(names.map((n) => http<unknown>('GET', `/${n}`)));
    return Object.fromEntries(names.map((n, i) => [n, data[i]]));
  },
};
