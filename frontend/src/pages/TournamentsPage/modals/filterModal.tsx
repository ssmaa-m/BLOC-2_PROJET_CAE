import { FilterModalContent } from './FilterModalContent';
import { ModalConfig } from '../../../types';
import { TournamentFilters } from '../../../utils/tournamentUtils';

export const filterModal = ({
  initialFilters,
  timeFrame,
  isAdmin,
  onFiltersChange,
  onConfirm,
}: {
  initialFilters: Partial<TournamentFilters>;
  timeFrame: 'past' | 'current' | 'future';
  isAdmin?: boolean;
  onFiltersChange: (filters: Partial<TournamentFilters>) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Filtres avancés',
  subtitle: 'Filtrez les tournois par équipe ou par membre.',
  confirmLabel: 'Appliquer',
  cancelLabel: 'Annuler',
  children: (
    <FilterModalContent
      initialFilters={initialFilters}
      timeFrame={timeFrame}
      isAdmin={isAdmin}
      onFiltersChange={onFiltersChange}
    />
  ),
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
