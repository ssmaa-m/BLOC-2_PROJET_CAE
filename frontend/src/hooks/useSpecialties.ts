import { useApi } from './useApi';
import { SpecialtyDto } from '../types';
import { useSnackbar } from './useSnackbar';
import { useState } from 'react';

export const useSpecialties = () => {
  const { showSnackbar } = useSnackbar();
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);

  const { execute: getAll, loading: isGettingSpecialties } = useApi(
    async () => {
      const response = await fetch('/api/specialties');
      if (!response.ok) {
        throw new Error('Échec de la récupération des spécialités !');
      }
      return response.json();
    },
    {
      onSuccess: (data) => setSpecialties(data),
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la récupération des spécialités !',
          severity: 'error',
        });
        setSpecialties([]);
      },
    },
  );

  return { specialties, getAll, isGettingSpecialties };
};
