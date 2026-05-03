import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { UserContext, UserContextProvider } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { User, AuthenticatedUser } from '../types';
import * as sessionUtils from '../utils/session';

// mock utils/session
vi.mock('../utils/session', () => ({
  getAuthenticatedUser: vi.fn(),
  storeAuthenticatedUser: vi.fn(),
  clearAuthenticatedUser: vi.fn(),
}));

// mock elements from sessionUtils
const mockedGetStoredUser = sessionUtils.getAuthenticatedUser as Mock;
const mockedStoreUser = sessionUtils.storeAuthenticatedUser as Mock;
const mockedClearStoredUser = sessionUtils.clearAuthenticatedUser as Mock;

describe('UserContext tests', () => {
  // mock snackbar
  const mockSnackbar: NonNullable<React.ContextType<typeof SnackbarContext>> = {
    showSnackbar: vi.fn(),
  };

  const mockNavigate = vi.fn();

  // mock Cleanup
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test component to recieve the tested cases data
  const TestComponent = () => {
    const { authenticatedUser, login, clearUser, isLoggingIn, register } =
      useContext(UserContext);

    const dummyUser: User = {
      email: 'test@test.com',
      password: '123',
      rememberMe: false,
    };

    const dummyRegisterData: User = {
      email: 'new@test.com',
      password: 'password123',
    };

    return (
      <div>
        <span data-testid="user">
          {authenticatedUser ? authenticatedUser.id : 'null'}
        </span>
        <span data-testid="loading">{isLoggingIn ? 'loading' : 'idle'}</span>
        <button onClick={() => login(dummyUser, mockNavigate)}>Login</button>
        <button onClick={() => register(dummyRegisterData, mockNavigate)}>
          Register
        </button>

        <button onClick={clearUser}>Logout</button>
      </div>
    );
  };

  it('automatically logs in if a token is found in session', async () => {
    const storedUser: AuthenticatedUser = {
      id: 1,
      admin: false,
      tag: 'stored-tag',
      token: 'abc',
    };

    mockedGetStoredUser.mockReturnValue(storedUser);

    // mock the fetch from backend
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        admin: false,
        tag: 'stored-tag',
        token: 'abc',
      }),
    });

    render(
      <SnackbarContext.Provider value={mockSnackbar}>
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      </SnackbarContext.Provider>,
    );

    // assert : check fetched id is correct
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('1');
    });
  });

  it('handles successful login and navigation', async () => {
    mockedGetStoredUser.mockReturnValue(null);

    const loginResponse: AuthenticatedUser = {
      id: 2,
      admin: true,
      tag: 'new-admin-tag',
      token: 'xyz',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => loginResponse,
    });

    render(
      <SnackbarContext.Provider value={mockSnackbar}>
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      </SnackbarContext.Provider>,
    );

    // trigger login
    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(mockedStoreUser).toHaveBeenCalledWith(
        expect.objectContaining({ id: 2 }),
        false,
      );
      // assert correct route to navigate
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(screen.getByTestId('user').textContent).toBe('2');
    });
  });

  it('shows error snackbar on login failure', async () => {
    mockedGetStoredUser.mockReturnValue(null);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Identifiants invalides' }),
    });

    render(
      <SnackbarContext.Provider value={mockSnackbar}>
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      </SnackbarContext.Provider>,
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(mockSnackbar.showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Identifiants invalides',
          severity: 'error',
        }),
      );
    });
  });

  it('clears the user on logout', async () => {
    render(
      <SnackbarContext.Provider value={mockSnackbar}>
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      </SnackbarContext.Provider>,
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(mockedClearStoredUser).toHaveBeenCalled();
    // assert user to be null after logout
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('handles successful registration and redirects to login', async () => {
    // mock fetch for the register endpoint
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(
      <SnackbarContext.Provider value={mockSnackbar}>
        <UserContextProvider>
          <TestComponent />
        </UserContextProvider>
      </SnackbarContext.Provider>,
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    await waitFor(() => {
      // Check if it navigated to login page
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
      // Check succes snackbar shown
      expect(mockSnackbar.showSnackbar).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
      );
    });
  });
});
