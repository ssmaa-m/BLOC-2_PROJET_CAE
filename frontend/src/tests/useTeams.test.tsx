import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTeams } from '../hooks/useTeams';
import { UserContext } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useModalController } from '../hooks/useModalController';
import {
  UserContextType,
  UserSummaryDto,
  AuthenticatedUser,
  TeamDetailsInfoDto,
  Member,
  ProfileInfoDto,
} from '../types';
import React from 'react';

// Mock modal controller
vi.mock('../hooks/useModalController', () => ({
  useModalController: vi.fn(),
}));

const mockUser: AuthenticatedUser = {
  id: 1,
  tag: 'Manager',
  token: 'Bearer token',
  admin: true,
  managedTeamId: 0,
};

const mockManager: UserSummaryDto = {
  id: 2,
  tag: 'NewManager',
  avatar: 'path/to/avatar',
};

const mockMember: Member = {
  id: 1,
  tag: 'Manager',
  email: 'manager@test.com',
  admin: true,
  deleted: false,
  profileImage: { idImage: 1, path: 'path' },
  specialty: { idSpecialty: 1, label: 'label' },
};

describe('useTeams hook', () => {
  const showSnackbar = vi.fn();
  const setErrorModal = vi.fn();
  const setAuthenticatedUser = vi.fn();

  const mockUserContextValue: UserContextType = {
    authenticatedUser: mockUser,
    setAuthenticatedUser,
    isLoggingIn: false,
    isRegistering: false,
    login: vi.fn(),
    register: vi.fn(),
    clearUser: vi.fn(),
  };

  const mockSnackbarContextValue = {
    showSnackbar,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserContext.Provider value={mockUserContextValue}>
      <SnackbarContext.Provider value={mockSnackbarContextValue}>
        {children}
      </SnackbarContext.Provider>
    </UserContext.Provider>
  );

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    // Mock modal controller to return the spy function
    vi.mocked(useModalController).mockReturnValue({
      setError: setErrorModal,
      setConfirmDisabled: vi.fn(),
      setLoading: vi.fn(),
      setSubtitle: vi.fn(),
    });
    vi.clearAllMocks();
  });

  it('should create a team and update global user state', async () => {
    // mock successful fetch
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ idTeam: 42, name: 'Team Alpha' }),
    } as Response);

    const setUser = vi.fn();
    const { result } = renderHook(() => useTeams({ setUser }), { wrapper });

    await act(async () => {
      await result.current.createTeam('Team Alpha');
    });

    // Check if global context updated the managedTeamId
    expect(setAuthenticatedUser).toHaveBeenCalledWith(
      expect.objectContaining({
        managedTeamId: 42,
      }),
    );

    // check if success snackbar is called
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
      }),
    );
  });

  it('should handle 409 error via modal controller', async () => {
    // mock error 409 fetch
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 409 } as Response);

    const { result } = renderHook(() => useTeams(), { wrapper });

    await act(async () => {
      await result.current.createTeam('ExistingTeam');
    });

    // Verify setError was called
    expect(setErrorModal).toHaveBeenCalled();
  });

  it('should promote to manager with optimism and rollback on 403', async () => {
    // mock error 403 reply
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 403 } as Response);

    const setTeam = vi.fn();
    const { result } = renderHook(() => useTeams({ setTeam }), { wrapper });

    await act(async () => {
      await result.current.promoteToManager(42, mockManager);
    });

    // check optimism: mock manager instantly added to managers
    const optimismFn = setTeam.mock.calls[0][0];
    const stateWithNewManager = optimismFn({
      managers: [],
    } as unknown as TeamDetailsInfoDto);
    expect(stateWithNewManager.managers).toContainEqual(mockManager);

    // Rollback check: after promise resolve with error check mock manager is no longer in the managers
    const rollbackFn = setTeam.mock.calls[1][0];
    const revertedState = rollbackFn({
      managers: [mockManager],
    } as unknown as TeamDetailsInfoDto);
    expect(revertedState.managers).not.toContainEqual(mockManager);
  });

  it('should quit team and update profile state', async () => {
    // mock successful quit team call
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const setUser = vi.fn();
    const { result } = renderHook(() => useTeams({ setUser }), { wrapper });

    await act(async () => {
      await result.current.quitTeam();
    });

    // check user no longer has a team
    const updateFn = setUser.mock.calls[0][0];
    const updatedProfile = updateFn({
      team: { id: 1 },
    } as unknown as ProfileInfoDto);
    expect(updatedProfile.team).toBeNull();
  });

  it('should resign as manager and handle rollback correctly', async () => {
    // mock manager resignation error 409 response
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 409 } as Response);

    const setTeam = vi.fn();
    const { result } = renderHook(() => useTeams({ setTeam }), { wrapper });

    await act(async () => {
      await result.current.resignManager(42);
    });

    // Optimism: current user is not in managers anymore
    const optimismFn = setTeam.mock.calls[0][0];
    const stateMinusManager = optimismFn({
      managers: [mockUser],
    } as unknown as TeamDetailsInfoDto);
    expect(stateMinusManager.managers).toHaveLength(0);

    // Rollback: current user back in managers
    const rollbackFn = setTeam.mock.calls[1][0];
    const restoredState = rollbackFn({
      members: [mockMember],
      managers: [],
    } as unknown as TeamDetailsInfoDto);
    expect(restoredState.managers).toContainEqual(mockMember);
  });

  it('should get team by id and handle error logic for 400 and 404', async () => {
    const mockTeam = { idTeam: 5, name: 'Team Rocket' };
    const setTeam = vi.fn();
    const setError = vi.fn();

    const { result } = renderHook(() => useTeams({ setTeam, setError }), {
      wrapper,
    });

    // mock success
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTeam,
      } as Response),
    );

    await act(async () => {
      await result.current.getById(5);
    });

    // assert: fetch to be called with correct endpoint
    expect(fetch).toHaveBeenCalledWith(
      '/api/teams/5/details',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
        },
      }),
    );
    expect(setTeam).toHaveBeenCalledWith(mockTeam);

    // call with invalid id
    await act(async () => {
      await result.current.getById(-1);
    });

    // expect to recieve error code
    expect(setError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 400,
      }),
    );

    // mock error 404 reply
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as Response),
    );

    await act(async () => {
      await result.current.getById(99);
    });

    expect(setError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
        message: 'Equipe introuvable',
      }),
    );
  });

  it('should fetch all teams and handle modal error display', async () => {
    const mockTeams = [
      { idTeam: 1, name: 'Team Alpha' },
      { idTeam: 2, name: 'Team Bravo' },
    ];
    const setTeams = vi.fn();

    const { result } = renderHook(() => useTeams({ setTeams }), { wrapper });

    // mock successful lislt fetch
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTeams,
      } as Response),
    );

    await act(async () => {
      await result.current.getAll({ isActive: true });
    });

    expect(fetch).toHaveBeenCalledWith('/api/teams?isActive=true', {
      headers: {
        Authorization: 'Bearer token',
      },
    });
    expect(setTeams).toHaveBeenCalledWith(mockTeams);

    // error list fetch
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response),
    );

    await act(async () => {
      await result.current.getAll({ isActive: true });
    });

    // Check that setErrorModal from useModalController was called
    expect(setErrorModal).toHaveBeenCalled();
  });

  it('should handle quitTeam errors with specific snackbar messages', async () => {
    const { result } = renderHook(() => useTeams({}), { wrapper });

    // mock error 409
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
      } as Response),
    );

    await act(async () => {
      await result.current.quitTeam();
    });

    // verify error snackbar is called
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
      }),
    );

    // mock error code 500
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response),
    );

    await act(async () => {
      await result.current.quitTeam();
    });
    // verify error snackbar is called
    expect(showSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
      }),
    );
  });
});
