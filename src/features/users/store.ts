import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useUsers = createEntityStore(api.users);
