import { MatchSummaryDto, ModalConfig } from '../../../types';
import { LineupModalContent } from './LineupModalContent';

export const lineupModal = ({
  match,
  teamId,
  onConfirm,
}: {
  match: MatchSummaryDto;
  teamId: number;
  onConfirm: (playerIds: number[], close: () => void) => void;
}): ModalConfig => {
  let currentSelection: number[] = [];

  return {
    title: 'Modifier la composition',
    subtitle:
      'Sélectionnez les joueurs de votre équipe qui participeront à ce match.',
    confirmLabel: 'Enregistrer',
    children: (
      <LineupModalContent
        matchId={match.idMatch}
        teamId={teamId}
        onChange={(ids) => {
          currentSelection = ids;
        }}
      />
    ),
    onConfirm: (close) => onConfirm(currentSelection, close),
    onCancel: (close) => close(),
  };
};
