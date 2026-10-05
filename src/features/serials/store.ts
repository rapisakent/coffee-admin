import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useSerials = createEntityStore(api.serials);
