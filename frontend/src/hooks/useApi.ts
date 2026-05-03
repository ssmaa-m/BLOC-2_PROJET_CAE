/**
 * @hook useApi
 *
 * @remarks
 * Use this hook for every mutation or query.
 * It provides a simple way to handle asynchronous operations with optimistic updates and rollbacks.
 *
 * The useApi hook will call onOptimism instantly. It will then call the execute function.
 * If the execute function fails, it will call onRollback and onError. If it succeeds, it will call onSuccess.
 *
 * @param fn - The asynchronous function that performs the API call.
 * @param options - onOptimism, onRollback, onSuccess, onError
 * @returns - An object containing the current state (data, loading, error), the execute function to trigger the API call, and a reset function to reset the state.
 *
 * @example
 * // Adding a new item to a list with optimistic UI
 * const { loading, execute } = useApi(
 *   async (newItem: { name: string }) => {
 *     const response = await fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) });
 *     return response.json(); // Returns the created item with its real database ID
 *   },
 *   {
 *     onOptimism: (newItem) => {
 *       // 1. Add item immediately with a temporary ID
 *       setItems(prev => [...prev, { ...newItem, id: 'temp-id' }]);
 *     },
 *     onSuccess: (savedItem, newItem) => {
 *       // 2. Replace the temporary ID with the real ID from the server
 *       setItems(prev => prev.map(item => item.id === 'temp-id' ? savedItem : item));
 *     },
 *     onRollback: (newItem) => {
 *       // 3. Revert the UI if the request fails
 *       setItems(prev => prev.filter(item => item.id !== 'temp-id'));
 *     },
 *     onError: (error) => showSnackbar(error.message, 'error');
 *   }
 * );
 */

import { useState, useCallback, useRef } from 'react';

interface UseApiOptions<TData, TArgs extends unknown[]> {
  onOptimism?: (...args: TArgs) => void;
  onRollback?: (...args: TArgs) => void;
  onSuccess?: (data: TData, ...args: TArgs) => void;
  onError?: (err: Error, ...args: TArgs) => void;
}

interface UseApiState<TData> {
  data: TData | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiReturn<TData, TArgs extends unknown[]>
  extends UseApiState<TData> {
  execute: (...args: TArgs) => Promise<TData | null>;
  reset: () => void;
}

export const useApi = <TData, TArgs extends unknown[] = []>(
  fn: (...args: TArgs) => Promise<TData>,
  options: UseApiOptions<TData, TArgs> = {},
): UseApiReturn<TData, TArgs> => {
  // Use refs to prevent infinite loops when execute is called in useEffect
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      const { onOptimism, onRollback, onSuccess, onError } = optionsRef.current;

      onOptimism?.(...args);
      setState({ data: null, loading: true, error: null });

      try {
        const data = await fnRef.current(...args);
        setState({ data, loading: false, error: null });
        onSuccess?.(data, ...args);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error });
        onRollback?.(...args);
        onError?.(error, ...args);
        return null;
      }
    },
    [], // empty dependency array means it's stable and won't be recreated on every render
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};
