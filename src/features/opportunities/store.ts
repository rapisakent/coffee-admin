import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useOpportunities = createEntityStore(api.opportunities);
