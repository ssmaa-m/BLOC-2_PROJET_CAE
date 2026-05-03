import { IconButton, Badge, Tooltip, Box } from '@mui/material';
import { Sliders } from '@gravity-ui/icons';
import { TournamentFilters } from '../../../utils/tournamentUtils';
import { useTournamentFilterButton } from '../hooks/useTournamentFilterButton';

interface TournamentFilterButtonProps {
  filters: TournamentFilters;
  setFilters: (filters: TournamentFilters) => void;
  disabled?: boolean;
  disabledTooltip?: string;
  isAdmin?: boolean;
}

export const TournamentFilterButton = ({
  filters,
  setFilters,
  disabled = false,
  disabledTooltip,
  isAdmin = false,
}: TournamentFilterButtonProps) => {
  const { activeFilterCount, tooltipTitle, handleOpenFilterModal } =
    useTournamentFilterButton({
      filters,
      setFilters,
      isAdmin,
      disabled,
      disabledTooltip,
    });

  return (
    <Tooltip title={tooltipTitle} arrow placement="bottom">
      <Badge
        badgeContent={activeFilterCount}
        color="primary"
        overlap="circular"
        invisible={activeFilterCount === 0 || disabled}
      >
        <Box component="span">
          <IconButton
            size="medium"
            color="secondary"
            onClick={handleOpenFilterModal}
            disabled={disabled}
          >
            <Sliders style={{ color: 'text.secondary' }} />
          </IconButton>
        </Box>
      </Badge>
    </Tooltip>
  );
};
