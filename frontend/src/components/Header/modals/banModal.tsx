import { ModalConfig } from '../../../types';
import { Typography } from '@mui/material';

export const banModal = ({
  tag,
  onConfirm,
  isLastMember,
}: {
  tag: string;
  onConfirm: (close: () => void) => void;
  isLastMember?: boolean;
}): ModalConfig => {
  return {
    title: 'Bannir ' + tag,
    subtitle:
      'Êtes-vous sûr de vouloir bannir ' +
      tag +
      ' ? Cette action est irréversible.',

    children: isLastMember ? (
      <Typography sx={{ mt: 0.3, color: '#d46666' }}>
        Attention : {tag} est le dernier membre de la team. Cela rendra la team
        inactive.
      </Typography>
    ) : undefined,

    confirmLabel: 'Bannir',
    confirmColor: 'error',
    cancelLabel: 'Annuler',

    onConfirm: async (close) => {
      onConfirm(close);
    },

    onCancel: (close) => close(),
  };
};
