import { Stack } from '@mui/material';
import { TabOption, Tabs } from './Tabs';
import { SearchBar } from './SearchBar';
import { TournamentMatchFilters } from '../types';

const tabOptions: TabOption<'tournaments' | 'matches'>[] = [
  { label: 'Tournois', value: 'tournaments' },
  { label: 'Matchs', value: 'matches' },
];

interface TournamentMatchControlsProps {
  filters: TournamentMatchFilters;
  setFilters: (filters: TournamentMatchFilters) => void;
}

export const TournamentMatchControls = ({
  filters,
  setFilters,
}: TournamentMatchControlsProps) => {
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
          options={tabOptions}
          value={filters.data}
          onChange={(data) => setFilters({ ...filters, data })}
        />
        <Stack direction="row" alignItems="center" spacing="0.75rem">
          <SearchBar
            searchQuery={filters.searchQuery}
            setSearchQuery={(searchQuery) =>
              setFilters({ ...filters, searchQuery })
            }
            label={
              filters.data === 'tournaments'
                ? 'Nom de tournoi...'
                : 'Nom de team...'
            }
            width="15rem"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
