import { useState } from 'react';
import { ProfilePicture } from '../types';
import { useApi } from './useApi';
import { useSnackbar } from './useSnackbar';

export const useProfilePictures = () => {
  const { showSnackbar } = useSnackbar();
  const [profilePictures, setProfilePictures] = useState<ProfilePicture[]>([]);

  const { execute: getAll, loading: isGettingProfilePictures } = useApi(
    async () => {
      const response = await fetch('/api/profile-images/');
      if (!response.ok) {
        throw new Error('Échec de la récupération des images de profil !');
      }
      return response.json();
    },
    {
      onSuccess: (data) => setProfilePictures(data),
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la récupération des images de profil !',
          severity: 'error',
        });
        setProfilePictures([]);
      },
    },
  );

  return { profilePictures, getAll, isGettingProfilePictures };
};
