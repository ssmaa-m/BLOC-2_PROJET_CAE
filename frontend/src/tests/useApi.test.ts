import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

describe('useApi hook', () => {
  it('should handle a successful API call with optimism', async () => {
    // mock with delay to catch the loading
    const mockFn = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve('server-data'), 10),
          ),
      );
    const onOptimism = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useApi(mockFn, { onOptimism, onSuccess }),
    );

    // execution
    let promise: Promise<unknown>;
    await act(async () => {
      promise = result.current.execute('arg1');
    });

    // check immediately for optimism and loading state
    expect(onOptimism).toHaveBeenCalledWith('arg1');
    expect(result.current.loading).toBe(true);

    // wait for promise to resolve
    await act(async () => {
      await promise;
    });

    // check promise after resolve
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('server-data');
    expect(onSuccess).toHaveBeenCalledWith('server-data', 'arg1');
  });

  it('should handle errors and trigger rollback', async () => {
    // mocks that fail
    const error = new Error('API Failed');
    const mockFn = vi.fn().mockRejectedValue(error);
    const onRollback = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useApi(mockFn, { onRollback, onError }),
    );

    // Execute
    await act(async () => {
      await result.current.execute('arg1');
    });

    // verify error
    expect(onRollback).toHaveBeenCalledWith('arg1');
    expect(onError).toHaveBeenCalledWith(error, 'arg1');
    expect(result.current.error).toBe(error);
    expect(result.current.loading).toBe(false);
  });

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useApi(vi.fn()));

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
