import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJoinRequests } from '../hooks/useJoinRequests';
import { UserContext } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import {
  AuthenticatedUser,
  JoinRequestDto,
  TeamDetailsInfoDto,
  UserContextType,
} from '../types';
import React from 'react';

const mockUser: AuthenticatedUser = {
  id: 1,
  tag: 'Player1',
  token: 'Bearer mock-token',
  admin: false,
};

const mockJoinRequest: JoinRequestDto = {
  idJoinRequest: 10,
  requester: {
    id: 5,
    tag: 'NewPlayer',
    avatar: 'avatar',
  },
  status: 'PENDING',
  idTeam: 0,
  teamName: '',
  expirationDate: '',
};

describe('useJoinRequests hook', () => {
  const showSnackbar = vi.fn();

  const mockUserContextValue: UserContextType = {
    authenticatedUser: mockUser,
    isLoggingIn: false,
    isRegistering: false,
    login: vi.fn(),
    register: vi.fn(),
    clearUser: vi.fn(),
    setAuthenticatedUser: vi.fn(),
  };

  const mockSnackbarContextValue = { showSnackbar };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserContext.Provider value={mockUserContextValue}>
      <SnackbarContext.Provider value={mockSnackbarContextValue}>
        {children}
      </SnackbarContext.Provider>
    </UserContext.Provider>
  );

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });

  describe('createJoinRequest', () => {
    it('should handle creation lifecycle: success and error mapping', async () => {
      const { result } = renderHook(() => useJoinRequests(), { wrapper });

      // simulate succesful fetch
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
      await act(async () => {
        await result.current.createJoinRequest(1);
      });

      // check correct endpoint is called
      expect(fetch).toHaveBeenCalledWith(
        '/api/teams/1/join-requests',
        expect.objectContaining({ method: 'POST' }),
      );
      // check success snackbar is called
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
        }),
      );

      // simulate code 409 fetch
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 409,
      } as Response);
      await act(async () => {
        await result.current.createJoinRequest(1);
      });
      // check error snackbar is called
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
        }),
      );

      // siulate code 404 fetch
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);
      await act(async () => {
        await result.current.createJoinRequest(99);
      });
      // check error snackbar is called
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
        }),
      );
    });
  });

  describe('updateJoinRequestStatus', () => {
    it('should handle optimistic updates and rollbacks correctly', async () => {
      const setTeam = vi.fn();
      const { result } = renderHook(() => useJoinRequests({ setTeam }), {
        wrapper,
      });

      // Trigger optimistic logic
      await act(async () => {
        await result.current.updateJoinRequestStatus(
          mockJoinRequest,
          'ACCEPTED',
          undefined,
        );
      });

      expect(setTeam).toHaveBeenCalled();
      const updaterFn = setTeam.mock.calls[0][0];
      const initialState = {
        joinRequests: [mockJoinRequest],
        members: [],
      } as unknown as TeamDetailsInfoDto;

      const nextState = updaterFn(initialState);
      expect(nextState.joinRequests).not.toContainEqual(mockJoinRequest);
      expect(nextState.members).toContainEqual(mockJoinRequest.requester);
    });

    it('should display correct snackbars for successes and various error codes', async () => {
      const { result } = renderHook(() => useJoinRequests(), { wrapper });

      // simulate succesful accept
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
      await act(async () => {
        await result.current.updateJoinRequestStatus(
          mockJoinRequest,
          'ACCEPTED',
          undefined,
        );
      });
      // verify succes snackbar is called
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
        }),
      );
      // simulate 404 accept
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);
      await act(async () => {
        await result.current.updateJoinRequestStatus(
          mockJoinRequest,
          'ACCEPTED',
          undefined,
        );
      });
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
        }),
      );

      // simulate code 400 reject
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);
      await act(async () => {
        await result.current.updateJoinRequestStatus(
          mockJoinRequest,
          'REJECTED',
          undefined,
        );
      });
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
        }),
      );

      // simulate code 403 reject
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response);
      await act(async () => {
        await result.current.updateJoinRequestStatus(
          mockJoinRequest,
          'ACCEPTED',
          undefined,
        );
      });
      expect(showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
        }),
      );
    });
  });
});
