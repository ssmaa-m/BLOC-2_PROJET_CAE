import { ModalConfig } from '../../../types';

export const declareForfeitModal = ({
  onConfirm,
}: {
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: `Déclarer forfait`,
  subtitle: `Êtes-vous sûr de vouloir déclarer forfait ?`,
  confirmLabel: 'Déclarer forfait',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
