import { Button, Stack, Typography } from '@mui/material';
import { TournamentDto } from '../types';
import { TournamentItem } from './TournamentItem';
import { TournamentItemSkeleton } from './TournamentListSkeleton';
import { useNavigate } from 'react-router-dom';
import { useTournamentsPage } from '../pages/TournamentsPage/hooks/useTournamentsPage';

const SectionSkeleton = () => (
  <Stack spacing="0.75rem">
    {Array.from({ length: 3 }).map((_, i) => (
      <TournamentItemSkeleton key={i} />
    ))}
  </Stack>
);

interface TournamentSectionProps {
  title: string;
  isLoading: boolean;
  tournaments: TournamentDto[];
  emptyMessage: string;
  timeFrame: 'past' | 'current' | 'future';
}

export const TournamentSection = ({
  title,
  isLoading,
  tournaments,
  emptyMessage,
  timeFrame,
}: TournamentSectionProps) => {
  const navigate = useNavigate();
  const { setFilters, filters } = useTournamentsPage();

  const handleViewAll = () => {
    setFilters({ ...filters, timeFrame, statuses: [] });
    navigate('/tournaments');
  };

  return (
    <Stack
      padding="1rem"
      spacing="0.75rem"
      bgcolor="background.s1"
      borderRadius="1.5rem"
    >
      <Stack direction="row" alignItems="center" pb="1rem">
        <Typography variant="h4" flex={1} pt="0.5rem">
          {title}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleViewAll}
        >
          Voir tout
        </Button>
      </Stack>

      {isLoading ? (
        <SectionSkeleton />
      ) : tournaments.length === 0 ? (
        <Stack
          padding="2rem 1.5rem"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Stack>
      ) : (
        tournaments.map((tournament) => (
          <TournamentItem
            key={tournament.idTournament}
            tournament={tournament}
            showFullDate
          />
        ))
      )}
    </Stack>
  );
};
