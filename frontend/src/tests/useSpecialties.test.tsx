import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpecialties } from '../hooks/useSpecialties';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { SpecialtyDto } from '../types';
import React from 'react';

const mockSpecialties: SpecialtyDto[] = [
  { id: 1, label: 'Top' },
  { id: 2, label: 'Jungle' },
];

describe('useSpecialties hook', () => {
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

  it('should fetch specialties and update internal state', async () => {
    // simulate server success
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockSpecialties,
    } as Response);

    const { result } = renderHook(() => useSpecialties(), { wrapper });

    await act(async () => {
      await result.current.getAll();
    });

    // verify local state update
    expect(result.current.specialties).toEqual(mockSpecialties);
    expect(result.current.isGettingSpecialties).toBe(false);
  });

  it('should clear specialties and show snackbar on failure', async () => {
    // simulate server crash
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useSpecialties(), { wrapper });

    await act(async () => {
      await result.current.getAll();
    });

    // check if state was reset to empty array
    expect(result.current.specialties).toEqual([]);

    // verify error notification
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Échec de la récupération des spécialités !',
        severity: 'error',
      }),
    );
  });
});
