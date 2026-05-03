import { ModalConfig } from '../../../types';
import { ChangePasswordModalContent } from './ChangePasswordModalContent';

export const changePasswordModal = ({
  onSelect,
  onConfirm,
}: {
  onSelect: (password: string | null) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Modifier mon mot de passe',
  subtitle:
    'Créez votre nouveau mot de passe en complétant les champs ci-dessous',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  children: <ChangePasswordModalContent onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
