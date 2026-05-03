import { Stack, Typography } from '@mui/material';
import { TournamentDto } from '../types';
import { TournamentItem } from './TournamentItem';

interface TournamentMonthGroupProps {
  month: string;
  monthTournaments: TournamentDto[];
}

export const TournamentMonthGroup = ({
  month,
  monthTournaments,
}: TournamentMonthGroupProps) => {
  return (
    <Stack
      padding="1.5rem 1rem 1rem"
      spacing="0.75rem"
      bgcolor="background.s1"
      borderRadius="1.5rem"
    >
      <Typography variant="h4" pb="1rem">
        {month}
      </Typography>
      {monthTournaments.map((tournament) => (
        <TournamentItem key={tournament.idTournament} tournament={tournament} />
      ))}
    </Stack>
  );
};
