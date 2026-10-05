import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useProducts = createEntityStore(api.products);
