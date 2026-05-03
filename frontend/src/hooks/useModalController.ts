import { useContext } from 'react';
import { ModalControllerContext } from '../contexts/ModalControllerContext';

export const useModalController = () => {
  const ctx = useContext(ModalControllerContext);
  if (!ctx)
    throw new Error('useModalController must be used within ModalProvider');
  return ctx;
};
