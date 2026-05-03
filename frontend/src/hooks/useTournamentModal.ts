import { useContext } from 'react';
import { TournamentModalContext } from '../contexts/TournamentModalContext';

export const useTournamentModal = () => {
  const context = useContext(TournamentModalContext);
  if (!context) {
    throw new Error(
      'useTournamentModal must be used within a TournamentModalProvider',
    );
  }
  return context;
};
