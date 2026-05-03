import {
  ModalConfig,
  UserSummaryDto,
  TeamDetailsInfoDto,
} from '../../../types';
import { ManagerModalContent } from './ManagerModalContent';

export const managerModal = ({
  team,
  onSelect,
  onConfirm,
}: {
  team: TeamDetailsInfoDto | undefined;
  onSelect: (user: UserSummaryDto | null) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Désigner un Responsable',
  subtitle: 'Choisissez un utilisateur à désigner comme responsable.',
  confirmLabel: 'Désigner',
  cancelLabel: 'Annuler',
  children: <ManagerModalContent team={team} onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
