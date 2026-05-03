import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { TournamentMatchControls } from '../TournamentMatchControls';
import { TournamentListSkeleton } from '../TournamentListSkeleton';
import { TournamentYearGroup } from '../TournamentYearGroup';
import { MatchListSkeleton } from '../MatchListSkeleton';
import { MatchYearGroup } from '../MatchYearGroup';
import { useTournamentMatchSection } from './hooks/useTournamentMatchSection';

interface TournamentMatchSectionProps {
  id: number;
  focus: 'member' | 'team';
}

export const TournamentMatchSection = ({
  id,
  focus,
}: TournamentMatchSectionProps) => {
  const {
    filters,
    setFilters,
    tournaments,
    matches,
    isGettingTournaments,
    isGettingMatches,
    fetchWithFilters,
    groupedTournaments,
    groupedMatches,
  } = useTournamentMatchSection({ id, focus });

  useEffect(() => {
    fetchWithFilters();
  }, [fetchWithFilters]);
  return (
    <Stack spacing="1.5rem">
      <TournamentMatchControls filters={filters} setFilters={setFilters} />
      <Stack
        spacing="1rem"
        className={
          (isGettingTournaments && tournaments.length > 0) ||
          (isGettingMatches && matches.length > 0)
            ? 'opacity-pulse'
            : ''
        }
        sx={{
          transform:
            (isGettingTournaments && tournaments.length > 0) ||
            (isGettingMatches && matches.length > 0)
              ? 'scale(0.98)'
              : 'none',
          transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {filters.data === 'tournaments' &&
          (isGettingTournaments && tournaments.length === 0 ? (
            <TournamentListSkeleton />
          ) : groupedTournaments.length === 0 ? (
            <Stack
              padding="3rem 1.5rem"
              spacing="0.25rem"
              alignItems="center"
              justifyContent="center"
              sx={{
                background: (theme) => theme.palette.background.s1,
              }}
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
                {focus === 'team' ? 'Cette team' : 'Ce membre'} n'a peut-être
                encore participé à aucun tournoi. Ou vos filtres sont trop
                restrictifs.
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
          ))}

        {filters.data === 'matches' &&
          (isGettingMatches && matches.length === 0 ? (
            <MatchListSkeleton />
          ) : groupedMatches.length === 0 ? (
            <Stack
              padding="3rem 1.5rem"
              spacing="0.25rem"
              alignItems="center"
              justifyContent="center"
              sx={{
                background: (theme) => theme.palette.background.s1,
              }}
              borderRadius="1.5rem"
            >
              <Typography variant="h5" textAlign="center">
                Aucun match trouvé.
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                width="14rem"
                color="text.secondary"
              >
                {focus === 'team' ? 'Cette team' : 'Ce membre'} n'a peut-être
                encore participé à aucun matchs. Ou vos filtres sont trop
                restrictifs.
              </Typography>
            </Stack>
          ) : (
            groupedMatches.map((yearGroup) => (
              <MatchYearGroup
                key={yearGroup.year}
                year={yearGroup.year}
                daysData={yearGroup.daysData}
                yearTop="8rem"
                refetch={() => fetchWithFilters()}
              />
            ))
          ))}
      </Stack>
    </Stack>
  );
};
