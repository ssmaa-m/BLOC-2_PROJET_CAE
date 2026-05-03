import { useApi } from './useApi';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useSnackbar } from './useSnackbar';
import { ProfileInfoDto, Unavailability } from '../types';

interface UseUnavailabilitiesOptions {
  setUser: React.Dispatch<React.SetStateAction<ProfileInfoDto | undefined>>;
}

export const useUnavailabilities = (options: UseUnavailabilitiesOptions) => {
  const { setUser } = options;
  const { authenticatedUser } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();

  const { execute: addUnavailability, loading: isAddingUnavailability } =
    useApi(
      async (dates: { tempId: number; startDate: string; endDate: string }) => {
        const response = await fetch('/api/unavailabilities/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
          body: JSON.stringify({
            startDate: dates.startDate,
            endDate: dates.endDate,
          }),
        });

        if (!response.ok)
          throw new Error("Échec de l'ajout de l'indisponibilité.");

        return response.json();
      },
      {
        onOptimism: ({ tempId, startDate, endDate }) => {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              unavailabilities: [
                ...(prev.unavailabilities ?? []),
                { id: tempId, startDate, endDate },
              ],
            };
          });
        },
        onRollback: ({ tempId }) => {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              unavailabilities: (prev.unavailabilities ?? []).filter(
                (u) => u.id !== tempId,
              ),
            };
          });
        },
        onSuccess: (created, { tempId }) => {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              unavailabilities: (prev.unavailabilities ?? []).map((u) =>
                u.id === tempId ? { ...u, id: created.idUnavailability } : u,
              ),
            };
          });

          showSnackbar({
            message: 'Indisponibilité ajoutée avec succès !',
            severity: 'success',
          });
        },
        onError: (err) => {
          showSnackbar({
            message:
              err instanceof Error
                ? err.message
                : "Une erreur est survenue lors de l'ajout de l'indisponibilité.",
            severity: 'error',
          });
        },
      },
    );

  const { execute: deleteUnavailability, loading: isDeletingUnavailability } =
    useApi(
      async (unavailability: Unavailability) => {
        const response = await fetch(
          `/api/unavailabilities/${unavailability.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authenticatedUser?.token ?? '',
            },
          },
        );

        if (!response.ok)
          throw new Error("Échec de la suppression de l'indisponibilité.");
      },
      {
        onOptimism: (unavailability) => {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              unavailabilities: (prev.unavailabilities ?? []).filter(
                (u) => u.id !== unavailability.id,
              ),
            };
          });
        },
        onRollback: (unavailability) => {
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              unavailabilities: [
                ...(prev.unavailabilities ?? []),
                unavailability,
              ],
            };
          });
        },
        onSuccess: () => {
          showSnackbar({
            message: 'Indisponibilité supprimée avec succès !',
            severity: 'success',
          });
        },
        onError: (err) => {
          showSnackbar({
            message:
              err instanceof Error
                ? err.message
                : "Une erreur est survenue lors de la suppression de l'indisponibilité.",
            severity: 'error',
          });
        },
      },
    );

  return {
    addUnavailability,
    deleteUnavailability,
    isAddingUnavailability,
    isDeletingUnavailability,
  };
};
