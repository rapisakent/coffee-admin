import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useTickets = createEntityStore(api.tickets);
