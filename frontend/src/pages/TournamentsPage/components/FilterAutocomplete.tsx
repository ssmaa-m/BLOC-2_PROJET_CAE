import {
  Autocomplete,
  Avatar,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface FilterAutocompleteProps<T> {
  options: T[];
  value: T[];
  onChange: (newValue: T[]) => void;
  loading: boolean;
  placeholder: string;
  getOptionLabel: (option: T) => string;
  getOptionId: (option: T) => number | string;
  getOptionAvatar?: (option: T) => string | undefined;
}

export const FilterAutocomplete = <T,>({
  options,
  value,
  onChange,
  loading,
  placeholder,
  getOptionLabel,
  getOptionId,
  getOptionAvatar,
}: FilterAutocompleteProps<T>) => {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      loading={loading}
      loadingText="Chargement..."
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) =>
        getOptionId(option) === getOptionId(val)
      }
      autoHighlight
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderTags={(val, getTagProps) =>
        val.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          const avatar = getOptionAvatar?.(option);
          return (
            <Chip
              key={`${key}${getOptionId(option)}`}
              {...tagProps}
              label={getOptionLabel(option)}
              size="small"
              avatar={
                avatar ? (
                  <Avatar
                    src={`/assets/avatars/${avatar}`}
                    alt={getOptionLabel(option)}
                  />
                ) : undefined
              }
            />
          );
        })
      }
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const avatar = getOptionAvatar?.(option);
        return (
          <Stack
            key={key + getOptionId(option)}
            direction="row"
            component="li"
            {...optionProps}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              p: '0.5rem 1rem !important',
            }}
          >
            <Stack direction="row" alignItems="center" gap="0.75rem" flex={1}>
              {getOptionAvatar !== undefined && (
                <Avatar
                  src={avatar ? `/assets/avatars/${avatar}` : ''}
                  alt={getOptionLabel(option)}
                  sx={{ width: '1.5rem', height: '1.5rem' }}
                />
              )}
              <Typography variant="h5">{getOptionLabel(option)}</Typography>
            </Stack>
          </Stack>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      )}
    />
  );
};
