import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnavailabilities } from '../hooks/useUnavailabilities';
import { UserContext } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import {
  AuthenticatedUser,
  ProfileInfoDto,
  Unavailability,
  UserContextType,
} from '../types';
import React from 'react';

const mockUser: AuthenticatedUser = {
  id: 1,
  tag: 'Player1',
  token: 'Bearer mock-token',
  admin: false,
};

const initialProfile: ProfileInfoDto = {
  id: 1,
  tag: 'Player1',
  email: 'player@test.com',
  unavailabilities: [],
  avatar: 'avatar',
  isSelf: true,
  creationDate: 'date',
  team: {
    id: 1,
    name: 'team name',
    manager: true,
    hasOtherManager: true,
    membersCount: 1,
  },
  specialty: 'specialty',
  admin: true,
};

describe('useUnavailabilities hook', () => {
  const showSnackbar = vi.fn();

  // fulfill context interfaces
  const mockUserContextValue: UserContextType = {
    authenticatedUser: mockUser,
    isLoggingIn: false,
    isRegistering: false,
    login: vi.fn(),
    register: vi.fn(),
    clearUser: vi.fn(),
    setAuthenticatedUser: vi.fn(),
  };

  const mockSnackbarContextValue = {
    showSnackbar,
  };

  // test component
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserContext.Provider value={mockUserContextValue}>
      <SnackbarContext.Provider value={mockSnackbarContextValue}>
        {children}
      </SnackbarContext.Provider>
    </UserContext.Provider>
  );

  beforeEach(() => {
    // stub return for fetches
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  it('should add unavailability: optimism -> success', async () => {
    const realId = 999;
    // succes mock return
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ idUnavailability: realId }),
    } as Response);

    const setUser = vi.fn();
    // init hook
    const { result } = renderHook(() => useUnavailabilities({ setUser }), {
      wrapper,
    });

    const newDates = {
      tempId: 123,
      startDate: '2026-05-01',
      endDate: '2026-05-02',
    };

    await act(async () => {
      await result.current.addUnavailability(newDates);
    });

    // verify optimism is added with tempId
    const optimismFn = setUser.mock.calls[0][0];
    const stateWithTemp = optimismFn(initialProfile);
    expect(stateWithTemp.unavailabilities[0].id).toBe(123);

    // check success after resolution = tempid is replaced by real backend id
    const successFn = setUser.mock.calls[1][0];
    const finalState = successFn(stateWithTemp);
    expect(finalState.unavailabilities[0].id).toBe(realId);
    // verify succes snackbar is called
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  it('should rollback added unavailability if server fails', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const setUser = vi.fn();
    const { result } = renderHook(() => useUnavailabilities({ setUser }), {
      wrapper,
    });

    await act(async () => {
      await result.current.addUnavailability({
        tempId: 123,
        startDate: '...',
        endDate: '...',
      });
    });

    // verify rollback removed the item with tempId
    const rollbackFn = setUser.mock.calls[1][0];
    const stateAfterRollback = rollbackFn({ unavailabilities: [{ id: 123 }] });
    expect(stateAfterRollback.unavailabilities).toHaveLength(0);

    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  it('should delete unavailability: optimism -> rollback on error', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    const setUser = vi.fn();
    const { result } = renderHook(() => useUnavailabilities({ setUser }), {
      wrapper,
    });
    const toDelete: Unavailability = {
      id: 50,
      startDate: '2026-06-01',
      endDate: '2026-06-02',
    };

    await act(async () => {
      await result.current.deleteUnavailability(toDelete);
    });

    // check optimism removed dates immediatly
    const optimismFn = setUser.mock.calls[0][0];
    const stateMinusOne = optimismFn({ unavailabilities: [toDelete] });
    expect(stateMinusOne.unavailabilities).toHaveLength(0);

    // check rollback , dates restored after promise failure
    const rollbackFn = setUser.mock.calls[1][0];
    const restoredState = rollbackFn({ unavailabilities: [] });
    expect(restoredState.unavailabilities).toContainEqual(toDelete);
  });
});
