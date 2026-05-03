import { ModalConfig } from '../../../types';

export const publishTournamentMatchModal = (
  onConfirm: (close: () => void) => void,
): ModalConfig => ({
  title: 'Publier les matchs',
  subtitle:
    'Êtes-vous sûr de vouloir publier ces matchs ? Cette action ne pourra plus être annulée et rendra le tournoi public.',
  confirmLabel: 'Publier',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
