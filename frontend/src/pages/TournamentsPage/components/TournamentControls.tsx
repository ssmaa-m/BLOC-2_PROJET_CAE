import { Stack } from '@mui/material';
import { Tabs, TabOption } from '../../../components/Tabs';
import { TournamentFilterButton } from './TournamentFilterButton';
import { TournamentFilters } from '../../../utils/tournamentUtils';
import { SearchBar } from '../../../components/SearchBar';

const timeframeOptions: TabOption<'past' | 'current' | 'future'>[] = [
  { label: 'À venir', value: 'future' },
  { label: 'En cours', value: 'current' },
  { label: 'Passés', value: 'past' },
];

interface TournamentControlsProps {
  filters: TournamentFilters;
  setFilters: (filters: TournamentFilters) => void;
  isAdmin?: boolean;
}

export const TournamentControls = ({
  filters,
  setFilters,
  isAdmin = false,
}: TournamentControlsProps) => {
  return (
    <Stack
      pt="1.5rem"
      borderRadius="0 0 1.5rem 1.5rem"
      sx={{
        background: (theme) => theme.palette.background.s0,
        outline: '4px solid',
        outlineColor: 'background.s0',
      }}
      position="sticky"
      top="0"
      zIndex={10}
    >
      <Stack
        justifyContent="space-between"
        direction="row"
        bgcolor="background.s1"
        borderRadius="1.5rem"
        px="1.5rem"
        height="6rem"
        alignItems="center"
      >
        <Tabs
          options={timeframeOptions}
          value={filters.timeFrame}
          onChange={(timeFrame) =>
            setFilters({ ...filters, timeFrame, statuses: [] })
          }
        />
        <Stack direction="row" alignItems="center" spacing="0.75rem">
          <SearchBar
            searchQuery={filters.searchQuery}
            setSearchQuery={(searchQuery) =>
              setFilters({ ...filters, searchQuery })
            }
          />
          <TournamentFilterButton
            filters={filters}
            setFilters={setFilters}
            isAdmin={isAdmin}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
