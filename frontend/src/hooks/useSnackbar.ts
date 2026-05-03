import { useContext } from 'react';
import { SnackbarContext } from '../contexts/SnackbarContext';

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
};
