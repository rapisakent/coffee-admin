import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useSuppliers = createEntityStore(api.suppliers);
