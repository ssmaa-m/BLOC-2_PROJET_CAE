import { ModalConfig } from '../../../types';

export const quitConfirmationModal = ({
  onConfirm,
  state,
}: {
  onConfirm: (close: () => void) => void;
  state: 'NORMAL' | 'MANAGER_BLOCKED' | 'DISSOLVE';
}): ModalConfig => {
  if (state === 'MANAGER_BLOCKED')
    return {
      title: 'Action requise',
      subtitle:
        "Vous ne pouvez pas quitter l'équipe tant que vous en êtes le seul responsable. Veuillez d'abord désigner un nouveau responsable.",
      confirmLabel: 'OK',
      cancelLabel: 'Annuler',
      onConfirm: (close) => close(),
      onCancel: (close) => close(),
    };
  if (state === 'DISSOLVE')
    return {
      title: "Dissoudre l'équipe",
      subtitle:
        "Vous êtes le dernier membre de cette équipe. En la quittant, l'équipe sera définitivement désactivée. Souhaitez-vous continuer ?",
      confirmLabel: 'Dissoudre',
      confirmColor: 'error',
      cancelLabel: 'Annuler',
      onConfirm: (close) => onConfirm(close),
      onCancel: (close) => close(),
    };
  else
    return {
      title: 'Quitter la Team',
      subtitle:
        'Êtes-vous sûr de vouloir quitter cette Team ? Cette action est irréversible.',
      confirmLabel: 'Quitter',
      confirmColor: 'error',
      cancelLabel: 'Annuler',
      onConfirm: (close) => onConfirm(close),
      onCancel: (close) => close(),
    };
};
