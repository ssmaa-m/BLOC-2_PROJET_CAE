import { ModalConfig } from '../../../types';
import { JoinRequestRejectModalContent } from './JoinRequestRejectModalContent';

export const joinRequestRejectModal = ({
  onSelect,
  onConfirm,
}: {
  onSelect: (reason: string | null) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Refuser la demande',
  subtitle: 'Veuillez indiquer la raison du refus',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  children: <JoinRequestRejectModalContent onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
