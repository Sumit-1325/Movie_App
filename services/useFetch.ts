import { useState, useEffect, useCallback } from "react";

function useFetch<T, F extends (...args: any[]) => Promise<T>>(
  fetchFunction: F,
  autoFetch = true,
  initialArgs: Parameters<F> = [] as unknown as Parameters<F>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (...args: Parameters<F> | []) => {
    try {
      setLoading(true);
      setError(null);
      const finalArgs = args.length > 0 ? args : initialArgs;
      const result = await fetchFunction(...(finalArgs as any[]));
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, initialArgs]);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, reset, setData };
}

export default useFetch;