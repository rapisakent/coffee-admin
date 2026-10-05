import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useLeads = createEntityStore(api.leads);
