import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ModalContext, ModalContextProvider } from '../contexts/ModalContext';

describe('ModalContext Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children and stays closed by default', () => {
    render(
      <ModalContextProvider>
        <div data-testid="child">App Content</div>
      </ModalContextProvider>,
    );

    // asserts empty everything by default
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('submits the form and calls onConfirm', async () => {
    const onConfirmMock = vi.fn((close: () => void) => close());

    render(
      <ModalContextProvider>
        <ModalContext.Consumer>
          {(value) => (
            <button
              onClick={() =>
                value?.openModal({
                  title: 'Submit Test',
                  onConfirm: onConfirmMock,
                })
              }
            >
              Open Modal
            </button>
          )}
        </ModalContext.Consumer>
      </ModalContextProvider>,
    );

    //  Open the modal
    await act(async () => {
      screen.getByText('Open Modal').click();
    });

    // assert: check dialog is open
    expect(screen.getByText('Submit Test')).toBeDefined();

    // Find the form and fire the submit event
    const form = screen.getByRole('dialog').querySelector('form');
    if (!form) throw new Error('Form not found');

    await act(async () => {
      fireEvent.submit(form);
    });

    // assert: check the callback was triggered
    expect(onConfirmMock).toHaveBeenCalled();

    //  Clean up timers
    await act(async () => {
      vi.runAllTimers();
    });

    //  Assert diaglog is closed
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
