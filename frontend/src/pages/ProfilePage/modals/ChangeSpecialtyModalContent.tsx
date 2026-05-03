import { Autocomplete, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { SpecialtyDto } from '../../../types';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { useModalController } from '../../../hooks/useModalController';

interface ChangeSpecialtyModalContentProps {
  onSelect: (specialty: SpecialtyDto | null) => void;
  currentSpecialty: string;
}

export const ChangeSpecialtyModalContent = ({
  onSelect,
  currentSpecialty,
}: ChangeSpecialtyModalContentProps) => {
  const { specialties, getAll, isGettingSpecialties } = useSpecialties();
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialtyDto | null>(null);
  const { setError } = useModalController();

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    // Pass null if no specialty is selected, preventing API calls natively
    onSelect(selectedSpecialty);
  }, [selectedSpecialty, onSelect]);

  return (
    <Stack spacing="0.625rem">
      <Autocomplete
        options={specialties.filter((s) => s.label !== currentSpecialty)}
        loading={isGettingSpecialties}
        noOptionsText={
          isGettingSpecialties
            ? 'Chargement des spécialités...'
            : 'Aucune spécialité trouvée'
        }
        fullWidth
        value={selectedSpecialty}
        getOptionLabel={(e) =>
          e.label.charAt(0).toUpperCase() + e.label.slice(1)
        }
        autoHighlight
        onChange={(_, newValue) => {
          setSelectedSpecialty(newValue);
          setError(null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              'data-testid': 'specialty-select-input', // Add this
            }}
            placeholder="Sélectionnez une spécialité"
            required
            autoFocus
          />
        )}
      />
    </Stack>
  );
};
