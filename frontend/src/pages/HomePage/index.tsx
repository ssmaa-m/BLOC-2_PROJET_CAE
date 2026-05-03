import { Container, Stack } from '@mui/material';
import { TournamentSection } from '../../components/TournamentSection';
import { useHomePage } from './hooks/useHomePage';
import { useEffect } from 'react';

export const HomePage = () => {
  const {
    futureTournaments,
    currentTournaments,
    pastTournaments,
    isGettingFutureTournaments,
    isGettingCurrentTournaments,
    isGettingPastTournaments,
    fetchTournaments,
  } = useHomePage();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return (
    <Container
      component={Stack}
      spacing="2rem"
      padding="1.5rem 0 4rem 0"
      maxWidth="md"
    >
      <TournamentSection
        title="Tournois à venir"
        isLoading={isGettingFutureTournaments}
        tournaments={futureTournaments}
        emptyMessage="Aucun tournoi à venir."
        timeFrame="future"
      />
      <TournamentSection
        title="Tournois en cours"
        isLoading={isGettingCurrentTournaments}
        tournaments={currentTournaments}
        emptyMessage="Aucun tournoi en cours."
        timeFrame="current"
      />
      <TournamentSection
        title="Tournois passés"
        isLoading={isGettingPastTournaments}
        tournaments={pastTournaments}
        emptyMessage="Aucun tournoi passé."
        timeFrame="past"
      />
    </Container>
  );
};
