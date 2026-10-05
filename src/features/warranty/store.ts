import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useWarranty = createEntityStore(api.warranty);
