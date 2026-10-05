import { useCallback, useEffect, useState } from 'react';
import { errorMessage } from './http';

export type QueryStatus = 'loading' | 'ready' | 'error';

/** Load one read-only resource (e.g. api.dashboard.get) once on mount, with retry. */
export function useQuery<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<{ status: QueryStatus; data?: T; error?: string }>({ status: 'loading' });

  const run = useCallback(() => {
    setState({ status: 'loading' });
    fetcher().then(
      (data) => setState({ status: 'ready', data }),
      (e: unknown) => setState({ status: 'error', error: errorMessage(e) }),
    );
  }, [fetcher]);

  useEffect(run, [run]);
  return { ...state, reload: run };
}
