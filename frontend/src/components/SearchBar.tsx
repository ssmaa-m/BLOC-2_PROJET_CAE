import { InputBase, Stack } from '@mui/material';
import { Magnifier } from '@gravity-ui/icons';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  label?: string;
  fullwidth?: boolean;
  width?: string;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  label = 'Rechercher...',
  fullwidth = false,
  width = '12rem',
}: SearchBarProps) => {
  return (
    <InputBase
      sx={{
        bgcolor: 'background.s2',
        borderRadius: '1.125rem',
        height: '2.75rem',
        width: fullwidth ? '100%' : width,
        p: '0 0.375rem 0 1rem',
        '&:focus-within': {
          outline: '2px solid',
          outlineColor: 'primary.main',
        },
      }}
      placeholder={label}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      endAdornment={
        <Stack p="0.25rem" pr="0.5rem">
          <Magnifier style={{ color: 'text.secondary' }} />
        </Stack>
      }
    />
  );
};
