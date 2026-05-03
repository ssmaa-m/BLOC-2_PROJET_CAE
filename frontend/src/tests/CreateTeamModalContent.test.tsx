import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ModalControllerContext } from '../contexts/ModalControllerContext';
import { CreateTeamModalContent } from '../pages/ProfilePage/modals/CreateTeamModalContent';

describe('CreateTeamModalContent', () => {
  const setErrorMock = vi.fn();

  const renderWithContext = (ui: React.ReactElement) => {
    return render(
      <ModalControllerContext.Provider
        value={{
          setError: setErrorMock,
          setConfirmDisabled: vi.fn(),
          setLoading: vi.fn(),
          setSubtitle: vi.fn(),
        }}
      >
        {ui}
      </ModalControllerContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders team name input', () => {
    renderWithContext(<CreateTeamModalContent onSelect={() => {}} />);
    expect(screen.getByPlaceholderText('Nom de Team')).toBeTruthy();
  });

  test('calls onSelect and enables confirm button when valid text is entered', async () => {
    const onSelectMock = vi.fn();
    renderWithContext(<CreateTeamModalContent onSelect={onSelectMock} />);

    const input = screen.getByPlaceholderText('Nom de Team');
    fireEvent.change(input, { target: { value: 'My Awesome Team' } });

    await waitFor(() => {
      expect(onSelectMock).toHaveBeenCalledWith('My Awesome Team');
    });
  });

  test('disables confirm button when input is empty or whitespace', async () => {
    const onSelectMock = vi.fn();
    renderWithContext(<CreateTeamModalContent onSelect={onSelectMock} />);

    const input = screen.getByPlaceholderText('Nom de Team');

    // Test whitespace
    fireEvent.change(input, { target: { value: '   ' } });

    await waitFor(() => {
      expect(onSelectMock).toHaveBeenCalledWith(null);
    });
  });
});
