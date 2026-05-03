import { ModalConfig } from '../../../types';

export const registrationManagementModal = ({
  onConfirm,
  register = true,
}: {
  onConfirm: (close: () => void) => void;
  register: boolean;
}): ModalConfig => ({
  title: register ? 'Inscription au tournoi' : 'Désinscription du tournoi',
  subtitle: register
    ? 'Êtes-vous sûr de vouloir inscrire votre équipe à ce tournoi ?'
    : 'Êtes-vous sûr de vouloir désinscrire votre équipe de ce tournoi ?',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
