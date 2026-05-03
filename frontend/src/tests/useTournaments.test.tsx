import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { UserContext } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { ApiError, UserContextType, AuthenticatedUser } from '../types';
import { useTournaments } from '../hooks/useTournaments';

const mockShowSnackbar = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// context  mocks
const AUTH_USER: UserContextType = {
  authenticatedUser: {
    token: 'mock-token',
    id: 1,
    admin: true,
    tag: 'ADMIN#0001',
    managedTeamId: 0,
  } as AuthenticatedUser,
  register: vi.fn(),
  login: vi.fn(),
  clearUser: vi.fn(),
  isLoggingIn: false,
  isRegistering: false,
  setAuthenticatedUser: vi.fn(),
};

const mockSnackbarContext = {
  showSnackbar: mockShowSnackbar,
};

// test componenet to use the contexts
const wrapper = ({ children }: { children: ReactNode }) => (
  <SnackbarContext.Provider value={mockSnackbarContext}>
    <UserContext.Provider value={AUTH_USER}>
      <BrowserRouter>{children}</BrowserRouter>
    </UserContext.Provider>
  </SnackbarContext.Provider>
);

afterEach(() => {
  vi.clearAllMocks();
});

describe('useTournament basic tests', () => {
  it('calls getAll with correct query parameters', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ idTournament: 1, name: 'Test' }],
      } as Response),
    );

    // mock setTournaments
    const setTournaments = vi.fn();
    // init hook in a test enviroment with mocks
    const { result } = renderHook(() => useTournaments({ setTournaments }), {
      wrapper,
    });

    await act(async () => {
      // simulate user action that triggers getAll
      await result.current.getAll({
        statuses: ['DONE'],
        members: [123],
        teams: undefined,
        searchQuery: 'Pro',
      });
    });

    // assert
    expect(fetch).toHaveBeenCalledWith(
      '/api/tournaments/?statuses=DONE&membersIds=123&searchQuery=Pro',
    );
  });

  it('navigates to the tournament page after successful creation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ idTournament: 99, name: 'New Tournament' }),
      } as Response),
    );

    const onSuccess = vi.fn();
    // init hook
    const { result } = renderHook(() => useTournaments({ onSuccess }), {
      wrapper,
    });
    // act: create new tournament
    await act(async () => {
      await result.current.create({ name: 'New Tournament' });
    });
    // assert
    expect(mockNavigate).toHaveBeenCalledWith('/tournaments/99');
  });

  it('handles optimistic status update with typed fetch resolution', async () => {
    const setTournament = vi.fn();

    // promise with manual resolution
    let resolveFetch: (value: Response) => void = () => {};
    const fetchPromise = new Promise<Response>((res) => {
      resolveFetch = res;
    });

    vi.stubGlobal('fetch', vi.fn().mockReturnValue(fetchPromise));
    // init hook
    const { result } = renderHook(() => useTournaments({ setTournament }), {
      wrapper,
    });

    await act(async () => {
      const call = result.current.publish(1);

      // Check optimism before the promise is resolved
      expect(setTournament).toHaveBeenCalledWith(expect.any(Function));

      resolveFetch({
        ok: true,
        json: async () => ({ idTournament: 1, status: 'REGISTRATION_OPEN' }),
      } as Response);

      await call;
    });
    // assert
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' }),
    );
  });

  it('should handle registration conflict error (409)', async () => {
    // stub with error status
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
      } as Response),
    );

    const { result } = renderHook(() => useTournaments({}), { wrapper });

    await act(async () => {
      await result.current.register(1);
    });

    // assert: check error has been sent
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
      }),
    );
  });

  it('should get tournament by id and handle 404 error logic', async () => {
    const mockTournament = { id: 42, name: 'Mock tournament' };
    const setTournament = vi.fn();
    const setError = vi.fn();
    // init hook
    const { result } = renderHook(
      () =>
        useTournaments({
          setTournament,
          setError,
        }),
      { wrapper },
    );

    // succesful fetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTournament,
    } as Response);

    await act(async () => {
      await result.current.getById(42);
    });

    expect(fetch).toHaveBeenCalledWith('/api/tournaments/42', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_USER?.authenticatedUser?.token ?? '',
      },
    });
    expect(setTournament).toHaveBeenCalledWith(mockTournament);

    // fetch -> error 404
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await act(async () => {
      await result.current.getById(999);
    });

    expect(setError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 404,
      }),
    );
  });

  it('should update tournament details and sync states', async () => {
    const mockUpdatedTournament = { id: 1, name: 'Updated Name' };
    const setTournament = vi.fn();
    const onSuccess = vi.fn();
    const updateData = { name: 'Updated Name' };

    const { result } = renderHook(
      () =>
        useTournaments({
          setTournament,
          onSuccess,
        }),
      { wrapper },
    );

    // succes mock
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedTournament,
    } as Response);

    await act(async () => {
      await result.current.update(1, updateData);
    });

    // assert: correct fetch url
    expect(fetch).toHaveBeenCalledWith(
      '/api/tournaments/1',
      // assert: correct body return
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'mock-token',
        }),
        body: JSON.stringify(updateData),
      }),
    );

    expect(setTournament).toHaveBeenCalledWith(mockUpdatedTournament);
    expect(onSuccess).toHaveBeenCalledWith(mockUpdatedTournament);

    // error Mock
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    await act(async () => {
      await result.current.update(1, updateData);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Échec de la mise à jour',
        severity: 'error',
      }),
    );
  });
  it('should trigger onError logic and show snackbar when creation fails', async () => {
    const onError = vi.fn();
    const onSuccess = vi.fn();
    const tournamentData = { name: 'Invalid Tournament' };

    const { result } = renderHook(
      () =>
        useTournaments({
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    // simulate api error(code 400)
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as Response);

    await act(async () => {
      await result.current.create(tournamentData);
    });

    // verify callback on error has been called
    expect(onError).toHaveBeenCalledWith(expect.any(ApiError));
    //  verify error is displayed
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
      }),
    );

    // verify navigate and onsucces has never been called
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
