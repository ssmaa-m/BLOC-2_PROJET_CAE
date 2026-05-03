import { Alert, InputLabel, Stack, TextField } from '@mui/material';
import { TournamentFormData } from '../../../types';

export const NAME_MAX = 50;
export const DESCRIPTION_MAX = 255;

interface BaseTabProps {
  formData: TournamentFormData;
  onChange: (field: keyof TournamentFormData, value: number | string) => void;
  error?: string;
  isCreation?: boolean;
}

export const BaseTab = ({
  formData,
  onChange,
  error,
  isCreation,
}: BaseTabProps) => {
  return (
    <Stack spacing="1rem">
      <Stack spacing="0.25rem">
        <InputLabel required={isCreation}>Nom du tournoi</InputLabel>
        <TextField
          placeholder="ex: Worlds 2026"
          required
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          helperText={`${formData.name.length}/${NAME_MAX}`}
          slotProps={{
            htmlInput: { maxLength: NAME_MAX },
            formHelperText: {
              sx: { textAlign: 'right', opacity: 0.5 },
            },
          }}
        />
      </Stack>
      <Stack spacing="0.25rem">
        <InputLabel required={isCreation}>Description</InputLabel>
        <TextField
          placeholder="Décrivez votre tournoi"
          data-testid="tournament-form-description"
          multiline
          rows={3}
          required
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          helperText={`${formData.description.length}/${DESCRIPTION_MAX}`}
          slotProps={{
            htmlInput: { maxLength: DESCRIPTION_MAX },
            formHelperText: {
              sx: { textAlign: 'right', opacity: 0.5 },
            },
          }}
        />
      </Stack>
      {error && (
        <Alert
          data-testid="tournament-form-error"
          severity="error"
          size="small"
          sx={{
            mt: '2rem !important',
          }}
        >
          {error}
        </Alert>
      )}
    </Stack>
  );
};
