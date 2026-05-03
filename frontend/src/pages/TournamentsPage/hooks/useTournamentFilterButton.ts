import { useRef } from 'react';
import { TournamentFilters } from '../../../utils/tournamentUtils';
import { useModal } from '../../../hooks/useModal';
import { filterModal } from '../modals/filterModal';

interface UseTournamentFilterButtonOptions {
  filters: TournamentFilters;
  setFilters: (filters: TournamentFilters) => void;
  isAdmin?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const useTournamentFilterButton = ({
  filters,
  setFilters,
  isAdmin = false,
  disabled = false,
  disabledTooltip,
}: UseTournamentFilterButtonOptions) => {
  const { openModal } = useModal();

  const filtersRef = useRef<Partial<TournamentFilters>>({
    teams: [],
    members: [],
    statuses: [],
    dates: { minDate: undefined, maxDate: undefined },
  });

  const activeFilterCount =
    filters.teams.length +
    filters.members.length +
    filters.statuses.length +
    (filters.dates?.minDate ? 1 : 0) +
    (filters.dates?.maxDate ? 1 : 0);

  const getTooltipTitle = (): string => {
    if (disabled && disabledTooltip) return disabledTooltip;
    if (activeFilterCount === 0) return 'Pas de filtre actif';

    const plural = activeFilterCount > 1 ? 's' : '';
    return `${activeFilterCount} filtre${plural} actif${plural}`;
  };

  const handleOpenFilterModal = () => {
    const initialFilters: Partial<TournamentFilters> = {
      teams: [...filters.teams],
      members: [...filters.members],
      statuses: [...filters.statuses],
      dates: { ...filters.dates },
    };

    filtersRef.current = initialFilters;

    const onFiltersChange = (f: Partial<TournamentFilters>) => {
      filtersRef.current = f;
    };

    const onConfirm = (close: () => void) => {
      setFilters({ ...filters, ...filtersRef.current });
      close();
    };

    openModal(
      filterModal({
        initialFilters,
        timeFrame: filters.timeFrame,
        isAdmin,
        onFiltersChange,
        onConfirm,
      }),
    );
  };

  return {
    activeFilterCount,
    tooltipTitle: getTooltipTitle(),
    handleOpenFilterModal,
  };
};
