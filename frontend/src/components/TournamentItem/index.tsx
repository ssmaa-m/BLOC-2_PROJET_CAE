import { Stack, Typography } from '@mui/material';
import { TournamentDto } from '../../types';
import { TournamentDate } from './components/TournamentDate';
import { TournamentStatusChip } from './components/TournamentStatusChip';
import { Link } from 'react-router-dom';

interface TournamentItemProps {
  tournament: TournamentDto;
  showFullDate?: boolean;
}

export const TournamentItem = ({
  tournament,
  showFullDate = false,
}: TournamentItemProps) => {
  return (
    <Stack
      component={Link}
      to={`/tournaments/${tournament.idTournament}`}
      bgcolor="background.s2"
      borderRadius="0.75rem"
      overflow="hidden"
      border="1px solid"
      borderColor="divider"
      sx={{
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          cursor: 'pointer',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        height="4rem"
        gap="1rem"
      >
        <Stack direction="row" flex={1} pl="0.75rem"></Stack>
        <Typography variant="h3" textAlign="center">
          {tournament.name}
        </Typography>
        <Stack direction="row" flex={1} justifyContent="flex-end" pr="0.75rem">
          <Stack
            padding="0 0.75rem"
            borderRadius="0.5rem"
            border="1px solid"
            borderColor="divider"
            height="2rem"
            justifyContent="center"
          >
            <Typography variant="h6" color="text.secondary">
              {tournament.registrationsCount} / {tournament.capacity}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        width="100%"
        bgcolor="background.s3"
        height="2.5rem"
        alignItems="center"
        justifyContent="center"
        direction="row"
        px="0.75rem"
      >
        <TournamentDate
          startDate={tournament.startDate}
          endDate={tournament.endDate}
          forceMonth={showFullDate}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          textOverflow="ellipsis"
          noWrap
          maxWidth="50%"
        >
          {tournament.description}
        </Typography>
        <Stack color="text.secondary" alignItems="flex-end" flex={1}>
          <TournamentStatusChip status={tournament.status} />
        </Stack>
      </Stack>
    </Stack>
  );
};
