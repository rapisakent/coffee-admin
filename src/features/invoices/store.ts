import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useInvoices = createEntityStore(api.invoices);
