import { useContext } from 'react';
import { TournamentsPageContext } from '../../TournamentsPage/contexts/TournamentsPageContext';

export const useTournamentsPage = () => {
  const ctx = useContext(TournamentsPageContext);
  if (!ctx)
    throw new Error(
      'useTournamentsPage must be used within TournamentsPageProvider',
    );
  return ctx;
};
