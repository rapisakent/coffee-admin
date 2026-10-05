import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useCustomers = createEntityStore(api.customers);
