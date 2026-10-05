import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useActivity = createEntityStore(api.activity);
