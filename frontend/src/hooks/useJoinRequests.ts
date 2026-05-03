import { Dispatch, SetStateAction, useContext } from 'react';
import { ApiError, JoinRequestDto, TeamDetailsInfoDto } from '../types';
import { useApi } from './useApi';
import { useSnackbar } from './useSnackbar';
import { UserContext } from '../contexts/UserContext';

interface UseJoinRequestsOptions {
  setTeam?: Dispatch<SetStateAction<TeamDetailsInfoDto | undefined>>;
}

export const useJoinRequests = (options?: UseJoinRequestsOptions) => {
  const { setTeam } = options ?? {};
  const { authenticatedUser } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();

  const { execute: createJoinRequest, loading: isCreatingJoinRequest } = useApi(
    async (idTeam: number) => {
      if (isNaN(idTeam) || idTeam <= 0) return;

      const response = await fetch(`/api/teams/${idTeam}/join-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new ApiError(
            'Demande en attente ou utilisateur déjà dans une équipe.',
            response.status,
          );
        } else if (response.status === 404) {
          throw new ApiError('Equipe introuvable.', response.status);
        }
        throw new ApiError('Échec de la demande.', response.status);
      }
    },
    {
      onSuccess: () => {
        showSnackbar({
          message: 'Demande effectuée avec succès !',
          severity: 'success',
        });
      },
      onError: (err) => {
        const status = err instanceof ApiError ? err.status : 500;
        const message =
          status === 409
            ? "Vous avez déjà une demande en attente ou faites déjà partie d'une équipe."
            : status === 404
              ? "Cette équipe n'existe plus."
              : 'Une erreur est survenue lors de la demande.';
        showSnackbar({
          message,
          severity: 'error',
        });
      },
    },
  );

  const { execute: updateJoinRequestStatus, loading: isUpdatingJoinRequest } =
    useApi<void, [JoinRequestDto, 'ACCEPTED' | 'REJECTED', string | undefined]>(
      async (
        joinRequest: JoinRequestDto,
        status: 'ACCEPTED' | 'REJECTED',
        rejectionReason?: string,
      ) => {
        const response = await fetch(
          `/api/teams/join-requests/${joinRequest.idJoinRequest}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authenticatedUser?.token ?? '',
            },
            body: JSON.stringify({ status, rejectionReason }),
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new ApiError('Demande introuvable.', response.status);
          } else if (response.status === 400) {
            throw new ApiError('Demande déjà traitée.', response.status);
          } else if (response.status === 403) {
            throw new ApiError('Droits insuffisants.', response.status);
          }
          throw new ApiError(
            'Échec du traitement de la demande.',
            response.status,
          );
        }
      },
      {
        onOptimism: (joinRequest, status) => {
          setTeam?.((prev) => {
            if (!prev) return prev;

            const updatedRequests = (prev.joinRequests ?? []).filter(
              (jr) => jr.idJoinRequest !== joinRequest.idJoinRequest,
            );

            const updatedMembers =
              status === 'ACCEPTED'
                ? [...(prev.members ?? []), joinRequest.requester]
                : (prev.members ?? []);

            return {
              ...prev,
              joinRequests: updatedRequests,
              members: updatedMembers,
            };
          });
        },
        onSuccess: (_data, _joinRequest, status) => {
          showSnackbar({
            message:
              status === 'ACCEPTED' ? 'Demande acceptée !' : 'Demande refusée.',
            severity: 'success',
          });
        },
        onError: (err) => {
          const status = err instanceof ApiError ? err.status : 500;
          const message =
            status === 404
              ? "Cette demande n'existe plus ou a été annulée."
              : status === 400
                ? 'Cette demande a déjà été traitée par un autre manager.'
                : status === 403
                  ? "Vous n'avez pas les droits pour gérer cette demande."
                  : 'Une erreur est survenue lors du traitement de la demande.';
          showSnackbar({
            message,
            severity: 'error',
          });
        },
        onRollback: (joinRequest) => {
          setTeam?.((prev) => {
            if (!prev) return prev;

            const rolledBackMembers = prev.members.filter(
              (m) => m.id !== joinRequest.requester.id,
            );

            return {
              ...prev,
              joinRequests: [...(prev.joinRequests ?? []), joinRequest],
              members: rolledBackMembers,
            };
          });
        },
      },
    );

  return {
    createJoinRequest,
    updateJoinRequestStatus,
    isCreatingJoinRequest,
    isUpdatingJoinRequest,
  };
};
