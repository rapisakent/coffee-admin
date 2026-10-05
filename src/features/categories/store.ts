import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useCategories = createEntityStore(api.categories);
