import { Autocomplete, Stack, TextField } from '@mui/material';
import { SpecialtyDto, RegisterFormData } from '../../../types';

interface Step1Props {
  formData: RegisterFormData;
  specialties: SpecialtyDto[];
  loading: boolean;
  selectedSpecialty: SpecialtyDto | null;
  handleChange: (e: React.SyntheticEvent) => void;
  handleSpecialtyChange: (
    _: React.SyntheticEvent,
    e: SpecialtyDto | null,
  ) => void;
  errors: Partial<Record<keyof RegisterFormData, string>>;
}

export const Step1 = ({
  formData,
  specialties,
  loading,
  selectedSpecialty,
  handleChange,
  handleSpecialtyChange,
  errors,
}: Step1Props) => {
  return (
    <Stack spacing="0.625rem">
      <TextField
        fullWidth
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email || ''}
        required
        inputProps={{ 'data-testid': 'register-email-input' }}
      />
      <TextField
        fullWidth
        id="tag"
        name="tag"
        placeholder="Tag"
        variant="outlined"
        value={formData.tag}
        onChange={handleChange}
        error={!!errors.tag}
        helperText={errors.tag || ''}
        required
        inputProps={{ 'data-testid': 'register-tag-input' }}
      />
      <Autocomplete
        options={specialties}
        loading={loading}
        noOptionsText={
          loading
            ? 'Chargement des spécialités...'
            : 'Aucune spécialité trouvée'
        }
        fullWidth
        value={selectedSpecialty}
        getOptionLabel={(e) =>
          e.label.charAt(0).toUpperCase() + e.label.slice(1)
        }
        autoHighlight
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Sélectionnez une spécialité"
            error={!!errors.specialtyId}
            helperText={errors.specialtyId || ''}
            required
            inputProps={{
              ...params.inputProps,
              'data-testid': 'register-specialty-input',
            }}
          />
        )}
        onChange={handleSpecialtyChange}
      />
    </Stack>
  );
};
