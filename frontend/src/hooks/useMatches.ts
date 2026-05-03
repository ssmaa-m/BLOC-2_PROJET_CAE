import { Dispatch, SetStateAction } from 'react';
import {
  ApiError,
  ConfirmOrContestMatchParams,
  EncodeMatchResultDto,
  MatchSummaryDto,
  DeclareForfeitMatchParams,
} from '../types';
import { useApi } from './useApi';
import { useSnackbar } from './useSnackbar';
import { useModalController } from './useModalController';
import { useUser } from './useUser';

interface UseMatchesOptions {
  setMatches?: Dispatch<SetStateAction<MatchSummaryDto[]>>;
  refetch?: () => void;
}

export const useMatches = (config?: UseMatchesOptions) => {
  const { setError } = useModalController();
  const { setMatches, refetch } = config ?? {};
  const { showSnackbar } = useSnackbar();
  const { authenticatedUser } = useUser();

  const { execute: getAll, loading: isGettingMatches } = useApi(
    async ({
      memberId,
      teamId,
      searchQuery,
    }: {
      memberId?: number | undefined;
      teamId?: number | undefined;
      searchQuery?: string | undefined;
    }) => {
      const params = new URLSearchParams();
      if (memberId) params.append('memberId', memberId.toString());
      if (teamId) params.append('teamId', teamId.toString());
      if (searchQuery) params.append('searchQuery', searchQuery);

      const response = await fetch(
        `/api/matches/${params.size > 0 ? '?' : ''}${params.toString()}`,
      );
      if (!response.ok) {
        throw new ApiError(
          'Échec de la récupération des matchs !',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setMatches?.(data);
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la récupération des tournois !',
          severity: 'error',
        });
      },
    },
  );

  const { execute: updateLineup, loading: isUpdatingLineup } = useApi(
    async ({
      matchId,
      playerIds,
    }: {
      matchId: number;
      playerIds: number[];
    }) => {
      const response = await fetch(`/api/lineups/match/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify({ playerIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Échec de la mise à jour de la composition',
          response.status,
        );
      }
      return response.json();
    },
    {
      onSuccess: () => {
        refetch?.();
        showSnackbar({
          message: "Composition de l'équipe mise à jour.",
          severity: 'success',
        });
      },
      onError: (err) => {
        setError(
          err instanceof ApiError ? err.message : 'Une erreur est survenue',
        );
      },
    },
  );

  const { execute: getAvailableMembers, loading: isGettingAvailableMembers } =
    useApi(
      async ({ matchId }: { matchId: number }) => {
        const response = await fetch(
          `/api/matches/${matchId}/available-members`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: authenticatedUser?.token ?? '',
            },
          },
        );
        if (!response.ok) {
          throw new ApiError(
            'Impossible de récupérer les membres disponibles',
            response.status,
          );
        }
        return response.json();
      },
      {
        onError: (err) => {
          showSnackbar({
            message:
              err instanceof ApiError ? err.message : 'Une erreur est survenue',
            severity: 'error',
          });
        },
      },
    );

  const { execute: getLineup, loading: isGettingLineup } = useApi(
    async ({ matchId, teamId }: { matchId: number; teamId: number }) => {
      const response = await fetch(
        `/api/lineups/matches/${matchId}/teams/${teamId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );

      if (!response.ok) {
        throw new ApiError(
          'Impossible de récupérer la composition actuelle',
          response.status,
        );
      }
      return response.json();
    },
    {
      onError: (err) => {
        setError(
          err instanceof ApiError ? err.message : 'Erreur de composition',
        );
      },
    },
  );
  const {
    execute: confirmOrContestMatch,
    loading: isConfirmingOrContestingMatch,
  } = useApi(
    async ({
      id,
      isTeam1,
      isConfirming,
      previousMatch,
    }: ConfirmOrContestMatchParams) => {
      void previousMatch, isTeam1, isConfirming;
      if (isNaN(id) || id <= 0) return;

      const query = isConfirming
        ? `/api/matches/${id}/confirm`
        : `/api/matches/${id}/contest`;
      const response = await fetch(query, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Échec de la mise à jour du match !',
          response.status,
        );
      }
    },
    {
      onSuccess: (_, { isConfirming }) => {
        refetch?.();
        showSnackbar({
          message: `Scores ${isConfirming ? 'confirmés' : 'contestés'} avec succès !`,
          severity: 'success',
        });
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la mise à jour du match !',
          severity: 'error',
        });
      },
    },
  );

  const { execute: encodeMatchResult, loading: isEncodingMatchResult } = useApi(
    async ({ id, dto }: { id: number; dto: EncodeMatchResultDto }) => {
      if (isNaN(id) || id <= 0) return;

      const response = await fetch(`/api/matches/${id}/result`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authenticatedUser?.token ?? '',
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "Échec de l'encodage des scores !",
          response.status,
        );
      }
    },
    {
      onSuccess: () => {
        refetch?.();
        showSnackbar({
          message: 'Scores encodés avec succès !',
          severity: 'success',
        });
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : "Une erreur est survenue lors de l'encodage des scores !",
          severity: 'error',
        });
      },
    },
  );

  const { execute: declareForfeit, loading: isDeclaringForfeit } = useApi(
    async ({
      matchId,
      winningTeamId,
      forfeitingTeamId,
    }: DeclareForfeitMatchParams) => {
      const response = await fetch(`/api/matches/${matchId}/declare-forfeit`, {
        method: 'PATCH',
        headers: {
          Authorization: authenticatedUser?.token ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winningTeamId: winningTeamId,
          forfeitingTeamId: forfeitingTeamId,
        }),
      });

      if (!response.ok) {
        throw new ApiError(
          'Échec lors de la déclaration de forfait',
          response.status,
        );
      }
    },
    {
      onSuccess: () => {
        refetch?.();
        showSnackbar({
          message: 'Forfait déclaré avec succès',
          severity: 'success',
        });
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof ApiError
              ? err.message
              : 'Une erreur est survenue lors de la déclaration de forfait',
          severity: 'error',
        });
      },
    },
  );

  return {
    getAll,
    isGettingMatches,
    updateLineup,
    isUpdatingLineup,
    getAvailableMembers,
    isGettingAvailableMembers,
    getLineup,
    isGettingLineup,
    confirmOrContestMatch,
    isConfirmingOrContestingMatch,
    encodeMatchResult,
    isEncodingMatchResult,
    declareForfeit,
    isDeclaringForfeit,
  };
};
