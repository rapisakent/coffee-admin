import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useStocktakes = createEntityStore(api.stocktakes);
