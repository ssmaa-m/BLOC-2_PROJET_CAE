import { ModalConfig } from '../../../types';
import { JoinTeamModalContent } from './JoinTeamModalContent';
import { Team } from '../../../types';

export const joinTeamModal = ({
  onSelect,
  onConfirm,
}: {
  onSelect: (team: Team | null) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Rechercher une Team',
  subtitle: 'Demandez à rejoindre une Team ci-dessous',
  confirmLabel: 'Demander',
  cancelLabel: 'Annuler',
  children: <JoinTeamModalContent onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
