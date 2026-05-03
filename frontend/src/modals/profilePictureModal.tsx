import { ProfilePictureModalContent } from './ProfilePictureModalContent';
import { ModalConfig, ProfilePicture } from '../types';

export const profilePictureModal = ({
  onSelect,
  onConfirm,
}: {
  onSelect: (image: ProfilePicture) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Faites votre choix',
  subtitle: 'Choisissez une image de profil parmi les images proposées.',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  confirmDisabled: true,
  children: <ProfilePictureModalContent onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
