import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const usePriceList = createEntityStore(api.priceList);
