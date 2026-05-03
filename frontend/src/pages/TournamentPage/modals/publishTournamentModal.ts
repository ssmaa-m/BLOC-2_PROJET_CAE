import { ModalConfig } from '../../../types';

export const publishTournamentModal = (
  onConfirm: (close: () => void) => void,
): ModalConfig => ({
  title: 'Publier le tournoi',
  subtitle:
    'Êtes-vous sûr de vouloir publier ce tournoi ? Cette action ouvrira les inscriptions au public et ne pourra plus être annulée.',
  confirmLabel: 'Publier',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
