import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useDebts = createEntityStore(api.debts);
