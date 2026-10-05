import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useOrders = createEntityStore(api.orders);
