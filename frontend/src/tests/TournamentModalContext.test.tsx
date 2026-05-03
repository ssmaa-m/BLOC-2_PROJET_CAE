import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  TournamentModalContext,
  TournamentModalProvider,
} from '../contexts/TournamentModalContext';
import { TournamentDetailsInfoDto } from '../types';

// clean mocks
afterEach(() => {
  vi.clearAllMocks();
});

describe('TournamentModalContext basic tests', () => {
  const MOCK_TOURNAMENT: TournamentDetailsInfoDto = {
    idTournament: 1,
    name: 'mock name',
    description: 'Annual tournament',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    registrationDeadline: '2026-05-20T12:00:00',
    capacity: 32,
    status: 'REGISTRATION_OPEN',
    registrationsCount: 0,
    teams: [],
    matches: [],
  };

  // test componont
  const TestDisplay = () => {
    const context = useContext(TournamentModalContext);
    if (!context) return null;

    return (
      <div>
        <span data-testid="is-open">{String(context.isOpen)}</span>
        <span data-testid="edit-name">
          {context.tournamentToEdit?.name || 'none'}
        </span>
      </div>
    );
  };

  const TestTrigger = () => {
    const context = useContext(TournamentModalContext);
    if (!context) return null;

    return (
      <div>
        <button onClick={() => context.openCreateModal()}>Open Create</button>
        <button onClick={() => context.openEditModal(MOCK_TOURNAMENT)}>
          Open Edit
        </button>
        <button onClick={() => context.closeModal()}>Close Modal</button>
      </div>
    );
  };

  it('starts with closed state and null tournament', () => {
    render(
      <TournamentModalProvider>
        <TestDisplay />
      </TournamentModalProvider>,
    );

    expect(screen.getByTestId('is-open').textContent).toBe('false');
    expect(screen.getByTestId('edit-name').textContent).toBe('none');
  });

  it('updates state to open for creation', async () => {
    render(
      <TournamentModalProvider>
        <TestTrigger />
        <TestDisplay />
      </TournamentModalProvider>,
    );

    // wait for react to finish process
    await act(async () => {
      screen.getByText('Open Create').click();
    });

    // assert: modal open but tournament still null
    expect(screen.getByTestId('is-open').textContent).toBe('true');
    expect(screen.getByTestId('edit-name').textContent).toBe('none');
  });

  it('updates state with tournament data for editing', async () => {
    render(
      <TournamentModalProvider>
        <TestTrigger />
        <TestDisplay />
      </TournamentModalProvider>,
    );

    await act(async () => {
      screen.getByText('Open Edit').click();
    });

    expect(screen.getByTestId('is-open').textContent).toBe('true');
    expect(screen.getByTestId('edit-name').textContent).toBe('mock name');
  });

  /**
   * TEST: Closing
   * Verifies that closeModal() resets the isOpen flag to false.
   */
  it('resets state when closeModal is called', async () => {
    render(
      <TournamentModalProvider>
        <TestTrigger />
        <TestDisplay />
      </TournamentModalProvider>,
    );

    // First we open it...
    await act(async () => {
      screen.getByText('Open Edit').click();
    });

    // ...then we close it.
    await act(async () => {
      screen.getByText('Close Modal').click();
    });

    expect(screen.getByTestId('is-open').textContent).toBe('false');
  });

  // checks if onSuccess function passed into the modal is actually stored
  it('correctly passes the onSuccess callback through the context', async () => {
    const mockOnSuccess = vi.fn();
    let capturedCallback:
      | ((tournament: TournamentDetailsInfoDto) => void)
      | null = null;

    // check callback compoenents
    const CallbackChecker = () => {
      const context = useContext(TournamentModalContext);
      if (context) {
        capturedCallback = context.onSuccess;
      }
      return (
        <button onClick={() => context?.openCreateModal(mockOnSuccess)}>
          Set Callback
        </button>
      );
    };

    render(
      <TournamentModalProvider>
        <CallbackChecker />
      </TournamentModalProvider>,
    );

    await act(async () => {
      screen.getByText('Set Callback').click();
    });

    // verify context has the mock function
    expect(capturedCallback).toBe(mockOnSuccess);
  });
});
