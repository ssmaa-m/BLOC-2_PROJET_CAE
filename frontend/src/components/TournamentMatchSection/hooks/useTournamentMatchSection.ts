import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MatchSummaryDto,
  TournamentDto,
  TournamentMatchFilters,
} from '../../../types';
import { useTournaments } from '../../../hooks/useTournaments';
import { useMatches } from '../../../hooks/useMatches';
import { groupTournamentsByYearAndMonth } from '../../../utils/tournamentUtils';
import { groupMatchesByYearAndDay } from '../../../utils/matchUtils';

interface TournamentMatchSectionProps {
  id: number;
  focus: 'team' | 'member';
}

export const useTournamentMatchSection = ({
  id,
  focus,
}: TournamentMatchSectionProps) => {
  const [filters, setFilters] = useState<TournamentMatchFilters>({
    data: 'tournaments',
    searchQuery: '',
  });

  const [tournaments, setTournaments] = useState<TournamentDto[]>([]);
  const [matches, setMatches] = useState<MatchSummaryDto[]>([]);
  const { getAll, isGettingTournaments } = useTournaments({ setTournaments });
  const { getAll: getAllMatches, isGettingMatches } = useMatches({
    setMatches,
  });

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
    const teamFetchParams =
      filters.data === 'tournaments' ? { teams: [id] } : { teamId: id };

    const memberFetchParams =
      filters.data === 'tournaments' ? { members: [id] } : { memberId: id };
    const fetchParams =
      focus === 'team'
        ? { searchQuery: debouncedSearch, ...teamFetchParams }
        : { searchQuery: debouncedSearch, ...memberFetchParams };

    if (filters.data === 'tournaments') getAll(fetchParams);
    else if (filters.data === 'matches') getAllMatches(fetchParams);
  }, [id, debouncedSearch, getAll, getAllMatches, filters.data, focus]);

  const groupedTournaments = useMemo(() => {
    return groupTournamentsByYearAndMonth(tournaments);
  }, [tournaments]);

  const groupedMatches = useMemo(() => {
    return groupMatchesByYearAndDay(matches);
  }, [matches]);

  return {
    filters,
    setFilters,
    tournaments,
    matches,
    isGettingTournaments,
    isGettingMatches,
    fetchWithFilters,
    groupedTournaments,
    groupedMatches,
  };
};
