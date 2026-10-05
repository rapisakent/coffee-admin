import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const usePurchases = createEntityStore(api.purchases);
