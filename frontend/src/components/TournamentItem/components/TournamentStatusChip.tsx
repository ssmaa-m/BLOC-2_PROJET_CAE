import { Chip, ChipProps } from '@mui/material';
import { TournamentStatus } from '../../../types';
import { STATUS_LABELS } from '../../../utils/tournamentUtils';

interface TournamentStatusChipProps {
  status: TournamentStatus;
}

const STATUS_COLORS: Record<TournamentStatus, ChipProps['color']> = {
  REGISTRATION_OPEN: 'primary',
  IN_PROGRESS: 'success',
  REGISTRATION_CLOSED: 'warning',
  PLANNED: 'primary',
  DONE: 'secondary',
  IN_PREPARATION: 'secondary',
  CANCELLED: 'secondary',
};

export const TournamentStatusChip = ({ status }: TournamentStatusChipProps) => {
  return (
    <Chip
      label={STATUS_LABELS[status] ?? status}
      color={STATUS_COLORS[status] ?? 'secondary'}
      size="small"
    />
  );
};
