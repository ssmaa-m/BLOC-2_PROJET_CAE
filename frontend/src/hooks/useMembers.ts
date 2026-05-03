import { useApi } from './useApi';
import { Dispatch, SetStateAction, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import {
  Member,
  ProfilePicture,
  ProfileInfoDto,
  SpecialtyDto,
  MemberSummaryDto,
  ApiError,
  MemberQueryStatus,
} from '../types';
import { useSnackbar } from './useSnackbar';

interface UseMembersOptions {
  setUser?: Dispatch<SetStateAction<ProfileInfoDto | undefined>>;
  setError?: Dispatch<
    SetStateAction<
      { code: number; message: string; subtitle?: string } | undefined
    >
  >;
  setUsers?: Dispatch<SetStateAction<Member[]>>;
  setSummaries?: Dispatch<SetStateAction<MemberSummaryDto[]>>;
  setPendingIds?: Dispatch<SetStateAction<number[]>>;
}

export const useMembers = (options?: UseMembersOptions) => {
  const { setUser, setError, setUsers, setSummaries, setPendingIds } =
    options ?? {};
  const { authenticatedUser } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();

  const { execute: getAllSummaries, loading: isGettingSummaries } = useApi(
    async ({
      status,
      searchQuery,
    }: {
      status?: MemberQueryStatus;
      searchQuery?: string;
    }) => {
      const params = new URLSearchParams();
      if (status) params.append('statuses', status.toString());
      if (searchQuery) params.append('search', searchQuery);
      const response = await fetch(`/api/members?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la récupération des membres.',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: (data) => setSummaries?.(data),
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la récupération des membres.',
          severity: 'error',
        }),
    },
  );

  const { execute: getAll, loading: isGettingUsers } = useApi(
    async ({
      status,
      searchQuery,
    }: {
      status?: MemberQueryStatus;
      searchQuery?: string;
    }) => {
      const params = new URLSearchParams();
      if (status !== undefined) params.append('status', status);
      if (searchQuery) params.append('searchQuery', searchQuery);
      const response = await fetch(`/api/members/full?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la récupération des membres.',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: (data) => setUsers?.(data),
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la récupération des membres.',
          severity: 'error',
        }),
    },
  );

  const { execute: getById } = useApi(
    async (id: number) => {
      if (isNaN(id) || id <= 0) return;

      const response = await fetch(`/api/members/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la récupération du profil.',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: (data) => setUser?.(data),
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        setError?.({
          code: status,
          message:
            err instanceof ApiError ? err.message : 'Une erreur est survenue',
          subtitle:
            'Une erreur est survenue lors de la récupération du profil.',
        });
      },
    },
  );

  const { execute: updatePassword, loading: isUpdatingPassword } = useApi(
    async (newPassword: string) => {
      const response = await fetch(`/api/members/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la mise à jour du mot de passe.',
          response.status,
        );
      }
    },
    {
      onSuccess: () => {
        showSnackbar({
          message: 'Mot de passe modifié avec succès !',
          severity: 'success',
        });
      },
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la mise à jour du mot de passe.',
          severity: 'error',
        }),
    },
  );

  const { execute: updateAvatar, loading: isUpdatingAvatar } = useApi(
    async (avatar: ProfilePicture, previousAvatar: string) => {
      void previousAvatar;
      const response = await fetch(`/api/members/me/avatar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify(avatar),
      });
      if (!response.ok) {
        throw new ApiError(
          "Échec de la mise à jour de l'image de profil",
          response.status,
        );
      }
    },
    {
      onOptimism: (avatar) => {
        setUser?.((prev) => {
          if (!prev) return prev;
          return { ...prev, avatar: avatar.path };
        });
      },
      onRollback: (_, previousAvatar) => {
        setUser?.((prev) => {
          if (!prev) return prev;
          return { ...prev, avatar: previousAvatar };
        });
      },
      onSuccess: () => {
        showSnackbar({
          message: 'Image de profil mise à jour avec succès !',
          severity: 'success',
        });
      },
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : "Une erreur est survenue lors de la mise à jour de l'image de profil.",
          severity: 'error',
        }),
    },
  );

  const { execute: updateSpecialty, loading: isUpdatingSpecialty } = useApi(
    async (specialty: SpecialtyDto, previousSpecialty: string) => {
      void previousSpecialty;
      const response = await fetch(`/api/members/me/specialty`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify(specialty.id),
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la mise à jour de la spécialité.',
          response.status,
        );
      }
    },
    {
      onOptimism: (specialty) => {
        setUser?.((prev) => {
          if (!prev) return prev;
          return { ...prev, specialty: specialty.label };
        });
      },
      onRollback: (_, previousSpecialty) => {
        setUser?.((prev) => {
          if (!prev) return prev;
          return { ...prev, specialty: previousSpecialty };
        });
      },
      onSuccess: () => {
        showSnackbar({
          message: 'Spécialité modifiée avec succès !',
          severity: 'success',
        });
      },
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la mise à jour de la spécialité.',
          severity: 'error',
        }),
    },
  );

  const { execute: toggleAdmin, loading: isTogglingAdmin } = useApi(
    async (id: number, wasAdmin: boolean) => {
      void wasAdmin;
      const response = await fetch(`/api/members/${id}/admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        throw new ApiError(
          'Échec de la mise à jour du statut administrateur.',
          response.status,
        );
      }
    },
    {
      onOptimism: (id) => {
        setPendingIds?.((prev) => [...prev, id]);
        setUsers?.((prev) => {
          if (!prev) return prev;
          return prev.map((u) => (u.id === id ? { ...u, admin: !u.admin } : u));
        });
      },
      onRollback: (id, wasAdmin) => {
        setUsers?.((prev) => {
          if (!prev) return prev;
          return prev.map((u) => (u.id === id ? { ...u, admin: wasAdmin } : u));
        });
      },
      onSuccess: (_, id, wasAdmin) => {
        setPendingIds?.((prev) => prev.filter((pid) => pid !== id));
        showSnackbar({
          message: wasAdmin
            ? 'Administrateur rétrogradé au rang de membre avec succès !'
            : "Membre promu au rang d'administrateur avec succès !",
          severity: 'success',
        });
      },
      onError: (err, id) => {
        setPendingIds?.((prev) => prev.filter((pid) => pid !== id));
        showSnackbar({
          message:
            err.message ||
            'Une erreur est survenue lors de la mise à jour du statut administrateur.',
          severity: 'error',
        });
      },
    },
  );

  const { execute: banMember, loading: isBanningMember } = useApi(
    async (id: number) => {
      const response = await fetch(`/api/members/${id}/ban`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Échec du bannissement du membre.',
          response.status,
        );
      }
    },
    {
      onOptimism: (id) => {
        setPendingIds?.((prev) => [...prev, id]);
      },
      onSuccess: (_, id) => {
        setPendingIds?.((prev) => prev.filter((pid) => pid !== id));
        setUsers?.(
          (prev) =>
            prev?.map((u) => (u.id === id ? { ...u, deleted: true } : u)) ?? [],
        );
        showSnackbar({
          message: 'Membre banni avec succès',
          severity: 'success',
        });
      },
      onError: (err, id) => {
        setPendingIds?.((prev) => prev.filter((pid) => pid !== id));
        showSnackbar({
          message: err.message || 'Erreur lors du bannissement',
          severity: 'error',
        });
      },
    },
  );

  const checkIsLastMember = async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/members/${id}/is-last`, {
      headers: {
        Authorization: `Bearer ${authenticatedUser?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du membre');
    }

    return response.json();
  };

  return {
    getAll,
    getById,
    updatePassword,
    updateAvatar,
    updateSpecialty,
    toggleAdmin,
    getAllSummaries,
    banMember,
    isGettingUsers,
    isGettingSummaries,
    isUpdatingPassword,
    isUpdatingAvatar,
    isUpdatingSpecialty,
    isTogglingAdmin,
    isBanningMember,
    checkIsLastMember,
  };
};
