import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfilePictures } from '../hooks/useProfilePictures';

import { ProfilePicture } from '../types';
import React from 'react';
import { SnackbarContext } from '../contexts/SnackbarContext';

const mockPictures: ProfilePicture[] = [
  { idImage: 1, path: 'pic1.png' },
  { idImage: 2, path: 'pic2.png' },
];

describe('useProfilePictures hook', () => {
  const showSnackbar = vi.fn();

  const mockSnackbarContextValue = {
    showSnackbar,
  };

  // context provider wrapper
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SnackbarContext.Provider value={mockSnackbarContextValue}>
      {children}
    </SnackbarContext.Provider>
  );

  beforeEach(() => {
    // replace browser fetch
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('should fetch pictures and update internal state', async () => {
    // simulate server success
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPictures,
    } as Response);

    const { result } = renderHook(() => useProfilePictures(), { wrapper });

    await act(async () => {
      await result.current.getAll();
    });

    // verify state holds the mocked data
    expect(result.current.profilePictures).toEqual(mockPictures);
    expect(result.current.isGettingProfilePictures).toBe(false);
  });

  it('should clear pictures and show snackbar on error', async () => {
    // simulate server crash
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useProfilePictures(), { wrapper });

    await act(async () => {
      await result.current.getAll();
    });

    // verify empty list to be present in case of fail
    expect(result.current.profilePictures).toEqual([]);

    // verify error snackbar is called
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
      }),
    );
  });
});
