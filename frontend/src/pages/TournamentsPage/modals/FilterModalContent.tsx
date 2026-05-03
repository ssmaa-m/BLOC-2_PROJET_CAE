import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { FilterAutocomplete } from '../components/FilterAutocomplete';
import { DatePicker } from '@mui/x-date-pickers';
import { TournamentFilters } from '../../../utils/tournamentUtils';
import { ArrowRight, CircleXmark } from '@gravity-ui/icons';
import { theme } from '../../../themes';
import { useFilterModalContent } from '../hooks/useFilterModalContent';

interface FilterModalContentProps {
  initialFilters: Partial<TournamentFilters>;
  timeFrame: 'past' | 'current' | 'future';
  isAdmin?: boolean;
  onFiltersChange: (filters: Partial<TournamentFilters>) => void;
}

export const FilterModalContent = ({
  initialFilters,
  timeFrame,
  isAdmin = false,
  onFiltersChange,
}: FilterModalContentProps) => {
  const {
    statusOptions,
    showStatusFilter,
    allTeams,
    allMembers,
    selectedTeams,
    selectedMembers,
    selectedStatuses,
    isGettingAllTeams,
    isGettingSummaries,
    minDateValue,
    maxDateValue,
    hasDates,
    durationString,
    updateFilter,
    handleDateChange,
    handleResetDates,
  } = useFilterModalContent({
    initialFilters,
    timeFrame,
    isAdmin,
    onFiltersChange,
  });

  return (
    <Stack spacing="0.625rem">
      <FilterAutocomplete
        options={allTeams}
        value={selectedTeams}
        onChange={(teams) =>
          updateFilter(
            'teams',
            teams.map((t) => t.idTeam),
          )
        }
        loading={isGettingAllTeams}
        placeholder="Filtrer par équipes"
        getOptionLabel={(team) => team.name}
        getOptionId={(team) => team.idTeam}
      />
      <FilterAutocomplete
        options={allMembers}
        value={selectedMembers}
        onChange={(members) =>
          updateFilter(
            'members',
            members.map((m) => m.id),
          )
        }
        loading={isGettingSummaries}
        placeholder="Filtrer par membres"
        getOptionLabel={(member) => member.tag}
        getOptionId={(member) => member.id}
        getOptionAvatar={(member) => member.avatar ?? undefined}
      />
      {showStatusFilter && (
        <FilterAutocomplete
          options={statusOptions}
          value={selectedStatuses}
          onChange={(statuses) =>
            updateFilter(
              'statuses',
              statuses.map((s) => s.value),
            )
          }
          loading={false}
          placeholder="Filtrer par états"
          getOptionLabel={(status) => status.label}
          getOptionId={(status) => status.value}
        />
      )}
      <Stack
        spacing="1rem"
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <DatePicker
          format="DD/MM/YY"
          name="minDate"
          value={minDateValue}
          onChange={(date) => handleDateChange(date, 'minDate')}
        />
        <Tooltip title={durationString} arrow placement="top">
          <Box>
            <ArrowRight
              style={{
                color: theme.palette.text.secondary,
                cursor: 'help',
                height: '1rem',
                width: '1rem',
              }}
            />
          </Box>
        </Tooltip>
        <DatePicker
          format="DD/MM/YY"
          name="maxDate"
          value={maxDateValue}
          onChange={(date) => handleDateChange(date, 'maxDate')}
        />
        {hasDates && (
          <Tooltip title="Réinitialiser les dates" arrow placement="top">
            <IconButton
              size="small"
              color="secondary"
              sx={{
                marginLeft: '0.5rem !important',
                height: '2.25rem',
                width: '2.25rem',
              }}
              onClick={handleResetDates}
            >
              <CircleXmark style={{ color: theme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};
