import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TournamentsPageContextType, TournamentDto } from '../../../types';
import { useUser } from '../../../hooks/useUser';
import {
  getStatusesForTimeframe,
  groupTournamentsByYearAndMonth,
  TournamentFilters,
} from '../../../utils/tournamentUtils';
import { useTournaments } from '../../../hooks/useTournaments';

const defaultTournamentsPageContext: TournamentsPageContextType = {
  filters: {
    searchQuery: '',
    teams: [],
    members: [],
    timeFrame: 'future',
    statuses: [],
    dates: { minDate: undefined, maxDate: undefined },
  },
  fetchWithFilters: () => {},
  setFilters: () => {},
  authenticatedUser: null,
  isGettingTournaments: false,
  tournaments: [],
  groupedTournaments: [],
};

const TournamentsPageContext = createContext<TournamentsPageContextType>(
  defaultTournamentsPageContext,
);

const TournamentsPageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tournaments, setTournaments] = useState<TournamentDto[]>([]);
  const { authenticatedUser } = useUser();

  const [filters, setFilters] = useState<TournamentFilters>({
    searchQuery: '',
    teams: [],
    members: [],
    timeFrame: 'future',
    statuses: [],
    dates: { minDate: undefined, maxDate: undefined },
  });
  const { getAll, isGettingTournaments } = useTournaments({ setTournaments });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchQuery);

  useEffect(() => {
    if (filters.searchQuery === '') {
      setDebouncedSearch('');
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  const fetchWithFilters = useCallback(() => {
    const backendStatuses =
      filters.statuses.length > 0
        ? filters.statuses
        : getStatusesForTimeframe(filters.timeFrame, authenticatedUser?.admin);
    getAll({
      statuses: backendStatuses,
      members: filters.members.length > 0 ? filters.members : undefined,
      teams: filters.teams.length > 0 ? filters.teams : undefined,
      searchQuery: debouncedSearch,
      minDate: filters.dates?.minDate,
      maxDate: filters.dates?.maxDate,
    });
  }, [
    getAll,
    filters.timeFrame,
    filters.members,
    filters.teams,
    filters.statuses,
    filters.dates?.minDate,
    filters.dates?.maxDate,
    debouncedSearch,
    authenticatedUser?.admin,
  ]);

  // Group tournaments by year and then month, filtering by search locally
  const groupedTournaments = useMemo(() => {
    return groupTournamentsByYearAndMonth(tournaments);
  }, [tournaments]);

  const TournamentsPageContextValue: TournamentsPageContextType = useMemo(
    () => ({
      filters,
      fetchWithFilters,
      setFilters,
      authenticatedUser: authenticatedUser ?? null,
      isGettingTournaments,
      tournaments,
      groupedTournaments,
    }),
    [
      filters,
      fetchWithFilters,
      setFilters,
      authenticatedUser,
      isGettingTournaments,
      tournaments,
      groupedTournaments,
    ],
  );

  return (
    <TournamentsPageContext.Provider value={TournamentsPageContextValue}>
      {children}
    </TournamentsPageContext.Provider>
  );
};

export { TournamentsPageContext, TournamentsPageContextProvider };
