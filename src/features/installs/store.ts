import { api } from '../../api';
import { createEntityStore } from '../../stores/createEntityStore';

export const useInstalls = createEntityStore(api.installs);
