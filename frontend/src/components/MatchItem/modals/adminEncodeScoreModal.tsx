import { MatchSummaryDto, ModalConfig } from '../../../types';
import { AdminEncodeScoreModalContent } from './AdminEncodeScoreModalContent';

export const adminEncodeScoreModal = ({
  match,
  onConfirm,
  isEdit = false,
}: {
  match: MatchSummaryDto;
  onConfirm: (score1: number, score2: number, close: () => void) => void;
  isEdit?: boolean;
}): ModalConfig => {
  let s1 = match.team1.score ?? 0;
  let s2 = match.team2.score ?? 0;

  return {
    title: `${isEdit ? 'Corriger' : 'Encoder'} les scores`,
    subtitle: `${isEdit ? 'Correction' : 'Encodage'} des scores pour le match entre ${match.team1.name} et ${match.team2.name}.`,
    confirmLabel: 'Enregistrer',
    children: (
      <AdminEncodeScoreModalContent
        match={match}
        onChange={(score1, score2) => {
          s1 = score1;
          s2 = score2;
        }}
      />
    ),
    onConfirm: (close) => onConfirm(s1, s2, close),
    onCancel: (close) => close(),
  };
};
