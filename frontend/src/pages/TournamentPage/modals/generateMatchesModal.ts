import { ModalConfig } from '../../../types';

export const generateMatchesModal = (
  onConfirm: (close: () => void) => void,
  regenerate: boolean = false,
): ModalConfig => ({
  title: `${regenerate ? 'Reg' : 'G'}énerer les matchs`,
  subtitle: `Êtes-vous sûr de vouloir générer les matchs pour ce tournoi ${regenerate ? 'à nouveau' : ''} ? Cette action ne pourra plus être annulée.`,
  confirmLabel: 'Générer',
  onConfirm: (close) => onConfirm(close),
});
