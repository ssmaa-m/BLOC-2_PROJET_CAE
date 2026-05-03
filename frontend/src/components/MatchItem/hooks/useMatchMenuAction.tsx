import { useMatches } from '../../../hooks/useMatches';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { useUser } from '../../../hooks/useUser';
import {
  ConfirmOrContestMatchParams,
  DeclareForfeitMatchParams,
  MatchSummaryDto,
} from '../../../types';
import { adminEncodeScoreModal } from '../modals/adminEncodeScoreModal';
import { scoresConfirmationModal } from '../modals/scoresConfirmationModal';
import { declareForfeitModal } from '../modals/declareForfeitModal';
import { lineupModal } from '../modals/lineupModal';

export const useMatchMenuAction = ({
  match,
  refetch,
}: {
  match: MatchSummaryDto;
  refetch: () => void;
}) => {
  const {
    updateLineup,
    confirmOrContestMatch,
    declareForfeit,
    encodeMatchResult,
  } = useMatches({ refetch });
  const { openModal } = useModal();
  const { setLoading } = useModalController();
  const { authenticatedUser } = useUser();

  const handleForfeit = (params: DeclareForfeitMatchParams) => {
    openModal(
      declareForfeitModal({
        onConfirm: async (close) => {
          setLoading(true);
          await declareForfeit(params);
          close();
        },
      }),
    );
  };

  const handleEditComposition = () => {
    const teamId = authenticatedUser?.managedTeamId;
    if (!teamId) return;

    openModal(
      lineupModal({
        match,
        teamId,
        onConfirm: async (playerIds, close) => {
          setLoading(true);
          await updateLineup({ matchId: match.idMatch, playerIds });
          close();
        },
      }),
    );
  };

  const handleConfirmOrContestScore = (params: ConfirmOrContestMatchParams) => {
    openModal(
      scoresConfirmationModal({
        isConfirm: params.isConfirming,
        onConfirm: async (close) => {
          setLoading(true);
          await confirmOrContestMatch(params);
          close();
        },
      }),
    );
  };

  const handleEncodeScore = () => {
    openModal(
      adminEncodeScoreModal({
        match,
        onConfirm: async (score1, score2, close) => {
          setLoading(true);
          await encodeMatchResult({
            id: match.idMatch,
            dto: { scoreTeam1: score1, scoreTeam2: score2 },
          });
          close();
        },
      }),
    );
  };

  const handleEditScore = () => {
    openModal(
      adminEncodeScoreModal({
        match,
        isEdit: true,
        onConfirm: async (score1, score2, close) => {
          setLoading(true);
          await encodeMatchResult({
            id: match.idMatch,
            dto: { scoreTeam1: score1, scoreTeam2: score2 },
          });
          close();
        },
      }),
    );
  };

  return {
    handleForfeit,
    handleEditComposition,
    handleConfirmOrContestScore,
    handleEncodeScore,
    handleEditScore,
  };
};
