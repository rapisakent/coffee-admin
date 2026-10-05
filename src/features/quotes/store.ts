import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useQuotes = createEntityStore(api.quotes);
