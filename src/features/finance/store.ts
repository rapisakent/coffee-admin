import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useTransactions = createEntityStore(api.transactions);
