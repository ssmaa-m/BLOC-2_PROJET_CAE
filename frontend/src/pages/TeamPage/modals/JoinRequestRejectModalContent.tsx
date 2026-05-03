import { Stack, TextField } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useModalController } from '../../../hooks/useModalController';

interface JoinRequestRejectModalContentProps {
  onSelect: (reason: string | null) => void;
}

export const JoinRequestRejectModalContent = ({
  onSelect,
}: JoinRequestRejectModalContentProps) => {
  const [reason, setReason] = useState('');
  const { setError } = useModalController();

  useEffect(() => {
    if (reason.trim().length === 0) {
      setError(null);
      onSelect(null);
      return;
    }

    setError(null);
    onSelect(reason.trim());
  }, [reason, setError, onSelect]);

  const handleChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    setReason(input.value);
  };

  return (
    <Stack>
      <TextField
        autoFocus
        fullWidth
        placeholder="Raison du refus"
        value={reason}
        onChange={handleChange}
        multiline
        rows={2}
        required
        inputProps={{
          'data-testid': 'reject-reason-input',
        }}
      />
    </Stack>
  );
};
