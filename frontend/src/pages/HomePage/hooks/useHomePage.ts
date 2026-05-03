import { useCallback, useState } from 'react';
import { TournamentDto } from '../../../types';
import { useTournaments } from '../../../hooks/useTournaments';

export const useHomePage = () => {
  const [futureTournaments, setFutureTournaments] = useState<TournamentDto[]>(
    [],
  );
  const [currentTournaments, setCurrentTournaments] = useState<TournamentDto[]>(
    [],
  );
  const [pastTournaments, setPastTournaments] = useState<TournamentDto[]>([]);

  const {
    getFuture,
    getCurrent,
    getPast,
    isGettingFutureTournaments,
    isGettingCurrentTournaments,
    isGettingPastTournaments,
  } = useTournaments({
    setFutureTournaments,
    setCurrentTournaments,
    setPastTournaments,
  });

  const fetchTournaments = useCallback(async () => {
    await Promise.all([
      getFuture({ limit: 3 }),
      getCurrent({ limit: 3 }),
      getPast({ limit: 3 }),
    ]);
  }, [getFuture, getCurrent, getPast]);

  return {
    futureTournaments,
    currentTournaments,
    pastTournaments,
    isGettingFutureTournaments,
    isGettingCurrentTournaments,
    isGettingPastTournaments,
    fetchTournaments,
  };
};
