import { ModalConfig } from '../../../types';

export const scoresConfirmationModal = ({
  onConfirm,
  isConfirm,
}: {
  onConfirm: (close: () => void) => void;
  isConfirm: boolean;
}): ModalConfig => ({
  title: `${isConfirm ? 'Confirmer' : 'Contester'} les scores`,
  subtitle: `Êtes-vous sûr de vouloir ${isConfirm ? 'Confirmer' : 'Contester'} ces scores ? Cette action est irréversible. ${!isConfirm ? 'Les scores seront mis a jour après le re-visionnage du match.' : ''}`,
  confirmLabel: isConfirm ? 'Confirmer' : 'Contester',
  confirmColor: isConfirm ? 'primary' : 'error',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
