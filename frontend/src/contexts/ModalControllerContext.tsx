import { createContext } from 'react';

interface ModalController {
  setError: (error: string | null) => void;
  setConfirmDisabled: (disabled: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSubtitle: (subtitle: string | null) => void;
}

export const ModalControllerContext = createContext<ModalController | null>(
  null,
);
