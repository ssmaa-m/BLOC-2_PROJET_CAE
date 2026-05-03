import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { SnackbarContext, SnackbarProvider } from '../contexts/SnackbarContext';

describe('SnackbarContext basic tests', () => {
  // test component to trigger the snackbar
  const TestTrigger = () => {
    // using unknown cast to avoid missing type export
    const context = useContext(SnackbarContext) as unknown as NonNullable<
      React.ContextType<typeof SnackbarContext>
    >;

    return (
      <button
        onClick={() =>
          context.showSnackbar({
            message: 'Success Message',
            severity: 'success',
          })
        }
      >
        Trigger Snackbar
      </button>
    );
  };

  it('is hidden by default', () => {
    render(
      <SnackbarProvider>
        <div data-testid="child">Child Content</div>
      </SnackbarProvider>,
    );

    // assert: check that the child renders but no alert is visible
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.queryByText('Success Message')).toBeNull();
  });

  it('shows the message when showSnackbar is called', async () => {
    render(
      <SnackbarProvider>
        <TestTrigger />
      </SnackbarProvider>,
    );

    // act: click the button to show the snackbar
    await act(async () => {
      screen.getByText('Trigger Snackbar').click();
    });

    // assert: the message should now be in the document
    expect(screen.getByText('Success Message')).toBeDefined();
  });

  it('displays the correct severity class', async () => {
    render(
      <SnackbarProvider>
        <TestTrigger />
      </SnackbarProvider>,
    );

    await act(async () => {
      screen.getByText('Trigger Snackbar').click();
    });

    const alertElement = screen.getByRole('alert');
    // assert: check if severity is alert
    expect(alertElement.className).toContain('MuiAlert-standardSuccess');
  });

  it('handles overlapping showSnackbar calls', async () => {
    vi.useFakeTimers();
    render(
      <SnackbarProvider>
        <TestTrigger />
      </SnackbarProvider>,
    );

    const btn = screen.getByText('Trigger Snackbar');

    // click number 1 for snackbar trigger
    await act(async () => {
      btn.click();
    });
    // click number 2 right after the first one
    await act(async () => {
      btn.click();
    });

    // simulate 150ms, allows timeout
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    // assert: click number 2 is rendered after simulated 150ms
    expect(screen.getByText('Success Message')).toBeDefined();
    vi.useRealTimers();
  });
});
