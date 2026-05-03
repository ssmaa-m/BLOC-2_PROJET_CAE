import { Dispatch, SetStateAction, useContext } from 'react';
import {
  ApiError,
  ProfileInfoDto,
  TeamDetailsInfoDto,
  UserSummaryDto,
  FullTeamDto,
} from '../types';
import { UserContext } from '../contexts/UserContext';
import { useSnackbar } from './useSnackbar';
import { useApi } from './useApi';
import { useModalController } from './useModalController';

interface UseTeamsOptions {
  setUser?: Dispatch<SetStateAction<ProfileInfoDto | undefined>>;
  setTeam?: Dispatch<SetStateAction<TeamDetailsInfoDto | undefined>>;
  setError?: Dispatch<
    SetStateAction<
      { code: number; message: string; subtitle?: string } | undefined
    >
  >;
  setTeams?: Dispatch<SetStateAction<FullTeamDto[]>>;
}

export const useTeams = (options?: UseTeamsOptions) => {
  const { setUser, setError, setTeam, setTeams } = options ?? {};
  const { authenticatedUser, setAuthenticatedUser } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();
  const { setError: setErrorModal } = useModalController();

  const { execute: getById, loading: isGettingTeam } = useApi(
    async (idTeam: number) => {
      if (isNaN(idTeam) || idTeam <= 0)
        throw new ApiError('Identifiant invalide', 400);

      const response = await fetch(`/api/teams/${idTeam}/details`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        if (response.status === 404)
          throw new ApiError('Equipe introuvable', response.status);
        throw new ApiError(
          'Échec de la récupération de la Team.',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: (data) => setTeam?.(data),
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        setError?.({
          code: status,
          message:
            err instanceof ApiError ? err.message : 'Une erreur est survenue',
          subtitle:
            status === 404
              ? "La team que vous cherchez n'existe pas ou a été désactivée."
              : status === 400
                ? "L'identifiant de la team doit être un nombre positif."
                : 'Une erreur est survenue lors de la récupération de la Team.',
        });
      },
    },
  );

  const { execute: getAll, loading: isGettingAllTeams } = useApi(
    async ({
      isActive,
      searchQuery,
    }: {
      isActive?: boolean | undefined;
      searchQuery?: string | undefined;
    }) => {
      const params = new URLSearchParams();
      if (isActive) params.append('isActive', isActive.toString());
      if (searchQuery) params.append('searchQuery', searchQuery);
      const response = await fetch(
        `/api/teams${params.toString() ? '?' : ''}${params.toString()}`,
        {
          headers: {
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );

      if (!response.ok)
        throw new ApiError(
          'Erreur lors de la récupération des Teams',
          response.status,
        );

      return response.json();
    },
    {
      onSuccess: (data) => {
        setTeams?.(data);
      },
      onError: (err) => {
        setErrorModal(
          err instanceof ApiError ? err.message : 'Une erreur est survenue.',
        );
      },
    },
  );

  const { execute: createTeam, loading: isCreatingTeam } = useApi(
    async (selectedName: string) => {
      const response = await fetch('/api/teams/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify({ name: selectedName }),
      });

      if (!response.ok) {
        if (response.status === 409)
          throw new ApiError('Nom de Team déjà pris', response.status);
        else if (response.status === 400)
          throw new ApiError(
            "Utilisateur déjà membre d'une Team",
            response.status,
          );
        else
          throw new ApiError('Échec de la création de Team', response.status);
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        const team = {
          id: data.idTeam,
          name: data.name,
          manager: true,
          membersCount: 1,
          hasOtherManager: false,
        };
        setUser?.((prev) => (prev ? { ...prev, team } : prev));
        if (data.idTeam && authenticatedUser) {
          setAuthenticatedUser?.({
            ...authenticatedUser,
            managedTeamId: data.idTeam,
          });
        }
        showSnackbar({
          message: 'Team créée avec succès !',
          severity: 'success',
        });
      },

      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        const subtitle =
          status === 409
            ? 'Une équipe avec ce nom existe déjà.'
            : status === 400
              ? "Vous faites déjà parti d'une équipe." // Should never actually be displayed.
              : 'Une erreur est survenue lors de la création de la Team.';

        setErrorModal(subtitle);
      },
    },
  );

  const { execute: quitTeam, loading: isQuittingTeam } = useApi(
    async () => {
      const response = await fetch('/api/members/me/quit-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new ApiError(
            "Utilisateur n'appartient pas à l'équipe.",
            response.status,
          );
        }
        if (response.status === 409) {
          throw new ApiError('Dernier manager de la Team', response.status);
        }
        throw new ApiError('Échec du départ de la team.', response.status);
      }
    },
    {
      onSuccess: () => {
        setUser?.((prev) => (prev ? { ...prev, team: null } : prev));
        showSnackbar({
          message: "Vous avez quitté l'équipe avec succès.",
          severity: 'success',
        });
      },

      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        const message =
          status === 400
            ? 'Vous ne faites déjà plus partie de cette équipe.'
            : status === 409
              ? "Veuillez d'abord désigner un nouveau responsable"
              : 'Une erreur est survenue en quittant la team.';
        showSnackbar({
          message,
          severity: 'error',
        });
      },
    },
  );

  const { execute: promoteToManager, loading: isPromotingToManager } = useApi(
    async (idTeam: number, selectedManager: UserSummaryDto) => {
      const response = await fetch(
        `/api/teams/${idTeam}/manager/${selectedManager.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw new ApiError('Plus de place de responsable.', response.status);
        } else if (response.status === 400) {
          throw new ApiError(
            "L'utilisateur n'est pas dans l'équipe.",
            response.status,
          );
        } else if (response.status === 403) {
          throw new ApiError('Droits insuffisants.', response.status);
        } else if (response.status === 404) {
          throw new ApiError(
            'Equipe ou utilisateur introuvable.',
            response.status,
          );
        }
        throw new ApiError('Échec de la promotion.', response.status);
      }
    },
    {
      onOptimism: (_idTeam, selectedManager) => {
        setTeam?.((prev) =>
          prev
            ? {
                ...prev,
                managers: [...prev.managers, selectedManager!],
              }
            : undefined,
        );
      },
      onSuccess: () => {
        showSnackbar({
          message: 'Utilisateur promu manager avec succès !',
          severity: 'success',
        });
      },
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        const message =
          status === 409
            ? "Il n'y a plus de place de responsable libre dans l'équipe."
            : status === 400
              ? "L'utilisateur ne fait pas ou plus partie de l'équipe."
              : status === 403
                ? "Vous n'avez pas les droits de responsable."
                : status === 404
                  ? "L'équipe ou l'utilisateur est introuvable."
                  : 'Une erreur est survenue lors de la promotion.';
        showSnackbar({
          message,
          severity: 'error',
        });
      },
      onRollback: (_idTeam, selectedManager) => {
        setTeam?.((prev) =>
          prev
            ? {
                ...prev,
                managers: prev.managers.filter(
                  (m) => m.id !== selectedManager.id,
                ),
              }
            : undefined,
        );
      },
    },
  );

  const { execute: resignManager, loading: isResigningManager } = useApi(
    async (idTeam: number) => {
      const response = await fetch(`/api/teams/${idTeam}/resign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new ApiError(
            'Remplaçant obligatoire pour quitter le rôle.',
            response.status,
          );
        } else if (response.status === 403) {
          throw new ApiError(
            "Vous n'êtes pas responsable de cette équipe.",
            response.status,
          );
        } else if (response.status === 404) {
          throw new ApiError('Equipe introuvable.', response.status);
        }

        throw new ApiError('Échec de la démission.', response.status);
      }

      return response.json();
    },
    {
      onOptimism: () => {
        setTeam?.((prev) =>
          prev
            ? {
                ...prev,
                managers: prev.managers.filter(
                  (m) => m.id !== authenticatedUser?.id,
                ),
              }
            : undefined,
        );
      },
      onSuccess: (data) => {
        getById(data.idTeam);

        showSnackbar({
          message: 'Vous avez renoncé à votre rôle de responsable.',
          severity: 'success',
        });
      },
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;

        const message =
          status === 409
            ? 'Veuillez désigner un remplaçant avant de quitter votre rôle.'
            : status === 403
              ? "Vous n'avez pas les droits nécessaires."
              : status === 404
                ? "L'équipe est introuvable."
                : 'Une erreur est survenue lors de la démission.';

        showSnackbar({
          message,
          severity: 'error',
        });
      },
      onRollback: () => {
        setTeam?.((prev) => {
          if (!prev) return undefined;
          const currentUser = prev.members.find(
            (m) => m.id === authenticatedUser?.id,
          );
          if (!currentUser) return prev;
          return {
            ...prev,
            managers: [...prev.managers, currentUser],
          };
        });
      },
    },
  );

  const { execute: excludeMember, loading: isExcludiingMember } = useApi(
    async (idTeam: number, selectedMEmber: UserSummaryDto) => {
      const response = await fetch(
        `/api/teams/${idTeam}/exclude-member/${selectedMEmber.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Membre introuvable.', response.status);
        } else if (response.status === 400) {
          throw new ApiError(
            "Le membre n'est pas dans l'équipe.",
            response.status,
          );
        } else if (response.status === 409) {
          throw new ApiError(
            "Désignez un autre resppnsable avant d'exclure celui-ci.",
            response.status,
          );
        }
      }
    },
    {
      onOptimism: (_idTeam, selectedMEmber) => {
        setTeam?.((prev) =>
          prev
            ? {
                ...prev,
                members: prev.members.filter((m) => m.id !== selectedMEmber.id),
                managers:
                  prev.managers.length > 1 &&
                  prev.managers.includes(selectedMEmber)
                    ? prev.managers.filter((m) => m.id !== selectedMEmber.id)
                    : prev.managers,
              }
            : undefined,
        );
      },
      onSuccess: () => {
        showSnackbar({
          message: 'Membre exclu avec succès !',
          severity: 'success',
        });
      },
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        const message =
          status === 404
            ? 'Le membre est introuvable.'
            : status === 400
              ? "Le membre ne fait pas ou plus partie de l'équipe."
              : status === 409
                ? 'Le dernier responsable de la team ne peut pas etre exclu.'
                : "Une erreur est survenue lors de l'exclusion.";
        showSnackbar({
          message,
          severity: 'error',
        });
      },
      onRollback: (_idTeam, selectedMEmber) => {
        setTeam?.((prev) =>
          prev
            ? {
                ...prev,
                members: [...prev.members, selectedMEmber],
              }
            : undefined,
        );
      },
    },
  );

  return {
    getAll,
    getById,
    createTeam,
    quitTeam,
    promoteToManager,
    resignManager,
    excludeMember,
    isGettingAllTeams,
    isGettingTeam,
    isCreatingTeam,
    isQuittingTeam,
    isPromotingToManager,
    isResigningManager,
    isExcludiingMember,
  };
};
