import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { BrowserRouter } from 'react-router-dom';
import {
  NotificationContext,
  NotificationProvider,
} from '../contexts/NotificationContext';
import { UserContext } from '../contexts/UserContext';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { UserContextType } from '../types';

// clear mocks
afterEach(() => {
  vi.clearAllMocks();
});

describe('NotificationContext basic tests', () => {
  // mock snackbar context
  const mockSnackbarContext = {
    showSnackbar: vi.fn(),
  } as unknown as NonNullable<React.ContextType<typeof SnackbarContext>>;

  // mock users
  // without token
  const GUEST_USER = {
    authenticatedUser: null,
    setAuthenticatedUser: vi.fn(),
  } as unknown as UserContextType;

  // with token
  const AUTH_USER = {
    authenticatedUser: { token: 'mock-token' },
  } as unknown as UserContextType;

  // test component to display the data
  const TestDisplay = () => {
    const { allNotifications, unreadNotifications, unreadCount } =
      useContext(NotificationContext);
    return (
      <div>
        <span data-testid="list-size">
          {String(allNotifications?.length || 0)}
        </span>
        <span data-testid="unread-size">
          {String(unreadNotifications?.length || 0)}
        </span>
        <span data-testid="count">{String(unreadCount || 0)}</span>
      </div>
    );
  };

  // test component for the triggers
  const TestTrigger = () => {
    const { allNotifications, unreadCount, getAll, markAsRead } =
      useContext(NotificationContext);
    return (
      <div>
        <button onClick={() => getAll(false)}>Get All</button>
        <button onClick={() => markAsRead(1)}>Mark Read</button>
        <span data-testid="size">{String(allNotifications?.length || 0)}</span>
        <span data-testid="count">{String(unreadCount || 0)}</span>
      </div>
    );
  };

  it('starts with empty notifications and zero count', () => {
    render(
      <SnackbarContext.Provider value={mockSnackbarContext}>
        <UserContext.Provider value={GUEST_USER}>
          <BrowserRouter>
            <NotificationProvider>
              <TestDisplay />
            </NotificationProvider>
          </BrowserRouter>
        </UserContext.Provider>
      </SnackbarContext.Provider>,
    );

    // assert allNotifications and unreadNotifications are empty and count is 0
    expect(screen.getByTestId('list-size').textContent).toBe('0');
    expect(screen.getByTestId('unread-size').textContent).toBe('0');
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('updates the list when getAll is called', async () => {
    // Mock fetch from backend
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ idNotification: 1, content: 'Test', isRead: false }],
    });

    render(
      <SnackbarContext.Provider value={mockSnackbarContext}>
        <UserContext.Provider value={AUTH_USER}>
          <BrowserRouter>
            <NotificationProvider>
              <TestTrigger />
            </NotificationProvider>
          </BrowserRouter>
        </UserContext.Provider>
      </SnackbarContext.Provider>,
    );

    // Act: click
    await act(async () => {
      screen.getByText('Get All').click();
    });

    // Asssert: check size became 1
    await waitFor(() => {
      const sizeElement = screen.getByTestId('size');
      expect(sizeElement.textContent).toBe('1');
    });
  });

  it('optimistically updates while the fetch is still pending', async () => {
    // allows us to control when to call fetch
    let resolveFetch: (value: unknown) => void = () => {};

    // mock fetch
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(
      <SnackbarContext.Provider value={mockSnackbarContext}>
        <UserContext.Provider value={AUTH_USER}>
          <BrowserRouter>
            <NotificationProvider>
              <TestTrigger />
            </NotificationProvider>
          </BrowserRouter>
        </UserContext.Provider>
      </SnackbarContext.Provider>,
    );

    // Act: click
    await act(async () => {
      screen.getByText('Mark Read').click();
    });

    // assert fetch is called
    expect(global.fetch).toHaveBeenCalled();
    // assert count went down to 0 before fetch is resolved
    expect(screen.getByTestId('count').textContent).toBe('0');

    // cleanup : use resolve fetch for esLinter
    resolveFetch({
      ok: true,
      json: async () => ({}),
    });
  });

  it('rolls back the unreadCount if the API call fails', async () => {
    // mock fetch with internal error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(
      <SnackbarContext.Provider value={mockSnackbarContext}>
        <UserContext.Provider value={AUTH_USER}>
          <BrowserRouter>
            <NotificationProvider>
              <TestTrigger />
            </NotificationProvider>
          </BrowserRouter>
        </UserContext.Provider>
      </SnackbarContext.Provider>,
    );

    // act: click
    await act(async () => {
      screen.getByText('Mark Read').click();
    });

    // wait for snackbar to be called (to display the error)
    await waitFor(() => {
      expect(mockSnackbarContext.showSnackbar).toHaveBeenCalled();
    });

    // count to go back to initial value 1
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
