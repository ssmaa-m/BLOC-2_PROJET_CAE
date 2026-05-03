import { Chip, Tooltip, Typography } from '@mui/material';
import { getFormattedDate } from '../../../utils/tournamentUtils';
import { Calendar } from '@gravity-ui/icons';

interface TournamentDateProps {
  startDate: string;
  endDate: string;
  component?: 'Typography' | 'Chip';
  forceMonth?: boolean;
}

export const TournamentDate = ({
  startDate,
  endDate,
  component = 'Typography',
  forceMonth = false,
}: TournamentDateProps) => {
  if (component === 'Typography') {
    return (
      <Typography variant="h5" color="text.secondary" flex={1}>
        {getFormattedDate(startDate, endDate, forceMonth)}
      </Typography>
    );
  }

  return (
    <Tooltip title="Date de début et de fin du tournoi">
      <Chip
        size="medium"
        variant="text"
        icon={<Calendar style={{ width: '1rem', height: '1rem' }} />}
        label={getFormattedDate(startDate, endDate)}
      />
    </Tooltip>
  );
};
