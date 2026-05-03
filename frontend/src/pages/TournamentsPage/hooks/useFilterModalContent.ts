import { useState, useEffect, useMemo } from 'react';
import { FullTeamDto, MemberSummaryDto } from '../../../types';
import {
  TournamentFilters,
  getStatusesForTimeframe,
  STATUS_LABELS,
} from '../../../utils/tournamentUtils';
import { getDurationString } from '../../../utils/date';
import { useModalController } from '../../../hooks/useModalController';
import { useTeams } from '../../../hooks/useTeams';
import { useMembers } from '../../../hooks/useMembers';
import dayjs from 'dayjs';

const EMPTY_DATES = { minDate: undefined, maxDate: undefined };

interface UseFilterModalContentOptions {
  initialFilters: Partial<TournamentFilters>;
  timeFrame: 'past' | 'current' | 'future';
  isAdmin: boolean;
  onFiltersChange: (filters: Partial<TournamentFilters>) => void;
}

export const useFilterModalContent = ({
  initialFilters,
  timeFrame,
  isAdmin,
  onFiltersChange,
}: UseFilterModalContentOptions) => {
  // --- Status options (derived from timeframe) ---

  const availableStatuses = useMemo(
    () => getStatusesForTimeframe(timeFrame, isAdmin),
    [timeFrame, isAdmin],
  );

  const showStatusFilter = availableStatuses.length > 1;

  const statusOptions = useMemo(
    () =>
      availableStatuses.map((value) => ({
        label: STATUS_LABELS[value] ?? value,
        value,
      })),
    [availableStatuses],
  );

  // --- Local filter state ---

  const [localFilters, setLocalFilters] =
    useState<Partial<TournamentFilters>>(initialFilters);

  // --- Data fetching ---

  const [allTeams, setAllTeams] = useState<FullTeamDto[]>([]);
  const [allMembers, setAllMembers] = useState<MemberSummaryDto[]>([]);

  const { getAll: getAllTeams, isGettingAllTeams } = useTeams({
    setTeams: setAllTeams,
  });
  const { getAllSummaries: getAllMembers, isGettingSummaries } = useMembers({
    setSummaries: setAllMembers,
  });

  useEffect(() => {
    getAllTeams({ isActive: true });
    getAllMembers({});
  }, [getAllTeams, getAllMembers]);

  // --- Derived selections ---

  const selectedTeams = useMemo(
    () => allTeams.filter((t) => localFilters.teams?.includes(t.idTeam)),
    [allTeams, localFilters.teams],
  );

  const selectedMembers = useMemo(
    () => allMembers.filter((m) => localFilters.members?.includes(m.id)),
    [allMembers, localFilters.members],
  );

  const selectedStatuses = useMemo(
    () => statusOptions.filter((s) => localFilters.statuses?.includes(s.value)),
    [statusOptions, localFilters.statuses],
  );

  // --- Sync filters to parent ---

  useEffect(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  // --- Date validation ---

  const { setError } = useModalController();

  useEffect(() => {
    const { minDate, maxDate } = localFilters.dates ?? {};
    if (!minDate || !maxDate) return setError(null);

    const isValid = dayjs(minDate).isValid() && dayjs(maxDate).isValid();
    setError(isValid ? null : 'Les dates doivent être valides.');
  }, [localFilters.dates, setError]);

  // --- Filter update handlers ---

  const updateFilter = <K extends keyof TournamentFilters>(
    key: K,
    value: TournamentFilters[K],
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetDates = () => updateFilter('dates', EMPTY_DATES);

  const handleDateChange = (
    date: dayjs.Dayjs | null,
    field: 'minDate' | 'maxDate',
  ) => {
    if (!date) return;

    setLocalFilters((prev) => {
      const prevDates = prev.dates ?? EMPTY_DATES;
      const newDates = { ...prevDates, [field]: date.format('YYYY-MM-DD') };

      if (!newDates.minDate || !newDates.maxDate) {
        return { ...prev, dates: newDates };
      }

      const minD = dayjs(newDates.minDate);
      const maxD = dayjs(newDates.maxDate);

      // Auto-adjust if dates overlap or are the same day
      if (
        field === 'minDate' &&
        (minD.isAfter(maxD) || minD.isSame(maxD, 'day'))
      )
        newDates.maxDate = minD.add(7, 'day').format('YYYY-MM-DD');
      else if (
        field === 'maxDate' &&
        (maxD.isBefore(minD) || maxD.isSame(minD, 'day'))
      )
        newDates.minDate = maxD.subtract(7, 'day').format('YYYY-MM-DD');

      return { ...prev, dates: newDates };
    });
  };

  const minDateValue = localFilters.dates?.minDate
    ? dayjs(localFilters.dates.minDate)
    : null;
  const maxDateValue = localFilters.dates?.maxDate
    ? dayjs(localFilters.dates.maxDate)
    : null;
  const hasDates =
    !!localFilters.dates?.minDate || !!localFilters.dates?.maxDate;
  const durationString = getDurationString({
    startDate: minDateValue ?? dayjs(),
    endDate: maxDateValue ?? dayjs(),
  });

  return {
    statusOptions,
    allTeams,
    allMembers,
    selectedTeams,
    selectedMembers,
    selectedStatuses,
    isGettingAllTeams,
    isGettingSummaries,
    showStatusFilter,
    minDateValue,
    maxDateValue,
    hasDates,
    durationString,
    updateFilter,
    handleDateChange,
    handleResetDates,
  };
};
