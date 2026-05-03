import { ModalConfig } from '../../../types';

export const resignManagerModal = ({
  onConfirm,
}: {
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Renoncer à son rôle de responsable',
  subtitle:
    'Êtes-vous sûr de vouloir renoncer à votre rôle de responsable ? Cette action est irréversible.',
  confirmLabel: 'Renoncer',
  cancelLabel: 'Annuler',
  confirmColor: 'error',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
