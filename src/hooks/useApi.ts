import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiError } from '@/api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

/**
 * Small reusable data-fetching hook.
 * @param fetcher async function returning the data
 * @param deps dependency array — refetches when these change
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: getApiError(err) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return {
    ...state,
    refetch: execute,
    setData: (data) => setState((s) => ({ ...s, data })),
  };
}
