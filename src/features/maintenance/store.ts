import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useMaintenance = createEntityStore(api.maintenance);
