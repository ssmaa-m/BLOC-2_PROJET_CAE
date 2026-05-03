import {
  ModalConfig,
  TeamDetailsInfoDto,
  UserSummaryDto,
} from '../../../types';
import { ExcludeMemberModalContent } from './ExcludeMemberModalContent';

export const excludeMemberModal = ({
  team,
  onSelect,
  onConfirm,
}: {
  team: TeamDetailsInfoDto | undefined;
  onSelect: (user: UserSummaryDto | null) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Exclure un membre',
  subtitle: 'Choisissez un membre à exclure de la team.',
  confirmLabel: 'Exclure',
  cancelLabel: 'Annuler',
  children: <ExcludeMemberModalContent team={team} onSelect={onSelect} />,
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
