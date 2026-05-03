import { Stack, TextField } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useModalController } from '../../../hooks/useModalController';

interface CreateTeamModalContentProps {
  onSelect: (teamName: string | null) => void;
}

export const CreateTeamModalContent = ({
  onSelect,
}: CreateTeamModalContentProps) => {
  const [teamName, setTeamName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useModalController();

  useEffect(() => {
    if (localError) {
      onSelect(null);
      return;
    }

    setError(null);

    // Only pass actual string if it genuinely exists, else null (so API call doesn't fire).
    onSelect(teamName.trim().length > 0 ? teamName.trim() : null);
  }, [teamName, localError, setError, onSelect]);

  const handleChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    setTeamName(input.value);

    // Clear validation errors on typing
    if (localError) setLocalError(null);
  };

  return (
    <Stack>
      <TextField
        autoFocus
        id="teamName"
        name="teamName"
        placeholder="Nom de Team"
        onChange={handleChange}
        variant="outlined"
        error={!!localError}
        helperText={localError}
        required
        inputProps={{
          'data-testid': 'create-team-input',
        }}
      />
    </Stack>
  );
};
