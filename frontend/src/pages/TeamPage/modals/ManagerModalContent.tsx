import { useEffect, useState } from 'react';
import { useModalController } from '../../../hooks/useModalController';
import { UserSummaryDto, TeamDetailsInfoDto } from '../../../types';
import {
  Autocomplete,
  Avatar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface ManagerModalContentProps {
  team: TeamDetailsInfoDto | undefined;
  onSelect: (user: UserSummaryDto | null) => void;
}

export const ManagerModalContent = ({
  team,
  onSelect,
}: ManagerModalContentProps) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSummaryDto | null>(null);

  const { setError } = useModalController();

  useEffect(() => {
    onSelect(selectedUser);
  }, [selectedUser, onSelect]);

  return (
    <>
      <Autocomplete
        data-testid="manager-selection-autocomplete"
        options={
          team?.members.filter(
            (user: UserSummaryDto) =>
              !team?.managers.find((manager) => manager.id === user.id),
          ) ?? []
        }
        fullWidth
        value={selectedUser}
        getOptionLabel={(user) => user.tag}
        getOptionKey={(user) => user.id}
        autoHighlight
        onChange={(_, value) => {
          setSelectedUser(value);
          if (localError) {
            setLocalError(null);
            setError(null);
          }
        }}
        renderOption={(props, option) => (
          <Stack
            direction="row"
            component="li"
            {...props}
            data-testid={`manager-option-${option.tag}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              p: '0.5rem 1rem !important',
            }}
          >
            <Avatar
              src={option.avatar ? `/assets/avatars/${option.avatar}` : ''}
              alt={option.tag}
              sx={{ width: '1.5rem', height: '1.5rem' }}
            />
            <Typography variant="h5">{option.tag}</Typography>
          </Stack>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Sélectionnez un membre"
            error={!!localError}
            helperText={localError}
            required
            autoFocus
            inputProps={{
              ...params.inputProps,
              'data-testid': 'manager-selection-input',
            }}
          />
        )}
      />
    </>
  );
};
