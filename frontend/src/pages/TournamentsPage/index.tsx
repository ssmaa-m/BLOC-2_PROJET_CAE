import { Stack, Typography, Container } from '@mui/material';
import { TournamentYearGroup } from '../../components/TournamentYearGroup';
import { TournamentControls } from './components/TournamentControls';
import { TournamentListSkeleton } from '../../components/TournamentListSkeleton';
import { useTournamentsPage } from './hooks/useTournamentsPage';
import { useEffect } from 'react';

export const TournamentsPage = () => {
  const {
    filters,
    fetchWithFilters,
    setFilters,
    authenticatedUser,
    isGettingTournaments,
    tournaments,
    groupedTournaments,
  } = useTournamentsPage();

  useEffect(() => {
    fetchWithFilters();
  }, [fetchWithFilters]);
  return (
    <Container component={Stack} spacing="2rem" maxWidth="md">
      <TournamentControls
        filters={filters}
        setFilters={setFilters}
        isAdmin={authenticatedUser?.admin}
      />
      <Stack
        spacing="2rem"
        pb="4rem"
        className={
          isGettingTournaments && tournaments.length > 0 ? 'opacity-pulse' : ''
        }
        sx={{
          transform:
            isGettingTournaments && tournaments.length > 0
              ? 'scale(0.98)'
              : 'none',
          transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {isGettingTournaments && tournaments.length === 0 ? (
          <TournamentListSkeleton />
        ) : groupedTournaments.length === 0 ? (
          <Stack
            padding="3rem 1.5rem"
            spacing="0.25rem"
            alignItems="center"
            justifyContent="center"
            bgcolor="background.s1"
            borderRadius="1.5rem"
          >
            <Typography variant="h5" textAlign="center">
              Aucun tournoi trouvé.
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              width="14rem"
              color="text.secondary"
            >
              Aucun tournoi ne correspond à votre recherche.
            </Typography>
          </Stack>
        ) : (
          groupedTournaments.map((yearGroup) => (
            <TournamentYearGroup
              key={yearGroup.year}
              year={yearGroup.year}
              monthsData={yearGroup.monthsData}
            />
          ))
        )}
      </Stack>
    </Container>
  );
};
