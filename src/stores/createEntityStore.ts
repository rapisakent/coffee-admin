import { useEffect } from 'react';
import { create } from 'zustand';
import type { Collection } from '../api';
import { errorMessage } from '../api/http';

export type EntityStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface EntityState<T extends { id: string }> {
  items: T[];
  status: EntityStatus;
  /** Last load or save failure; a failed save is rolled back by re-syncing from the server. */
  error: string | null;
  reload: () => Promise<void>;
  add: (item: T) => Promise<void>;
  update: (id: string, patch: Partial<Omit<T, 'id'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Client cache for one API collection (see src/api). The hook loads the list on first use;
 * add / update / remove change the UI immediately, then call the API.
 */
export function createEntityStore<T extends { id: string }>(source: Collection<T>) {
  const store = create<EntityState<T>>()((set) => {
    const fetchAll = async (silent: boolean) => {
      if (!silent) set({ status: 'loading', error: null });
      try {
        set({ items: await source.list(), status: 'ready' });
      } catch (e) {
        set({ status: 'error', error: errorMessage(e) });
      }
    };

    const mutate = async (next: (items: T[]) => T[], request: () => Promise<unknown>) => {
      set((s) => ({ items: next(s.items), error: null }));
      try {
        await request();
      } catch (e) {
        await fetchAll(true);
        set({ error: errorMessage(e) });
      }
    };

    return {
      items: [],
      status: 'idle',
      error: null,
      reload: () => fetchAll(false),
      add: (item) => mutate((items) => [item, ...items], () => source.create(item)),
      update: (id, patch) =>
        mutate((items) => items.map((i) => (i.id === id ? { ...i, ...patch } : i)), () => source.update(id, patch)),
      remove: (id) => mutate((items) => items.filter((i) => i.id !== id), () => source.remove(id)),
    };
  });

  function useEntity(): EntityState<T>;
  function useEntity<S>(selector: (s: EntityState<T>) => S): S;
  function useEntity<S>(selector?: (s: EntityState<T>) => S) {
    useEffect(() => {
      const { status, reload } = store.getState();
      if (status === 'idle') void reload();
    }, []);
    return store(selector ?? ((s) => s as S));
  }

  return Object.assign(useEntity, { getState: store.getState });
}
