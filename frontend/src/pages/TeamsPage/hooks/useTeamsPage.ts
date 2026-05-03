import { useEffect, useState } from 'react';
import { FullTeamDto } from '../../../types';
import { useTeams } from '../../../hooks/useTeams';

export const useTeamsPage = () => {
  const [teams, setTeams] = useState<FullTeamDto[]>([]);
  const { getAll, isGettingAllTeams } = useTeams({ setTeams });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    getAll({ searchQuery: debouncedSearch });
  }, [getAll, debouncedSearch]);

  useEffect(() => {
    console.log(searchQuery);
    if (searchQuery === '') {
      setDebouncedSearch('');
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return { teams, isGettingAllTeams, searchQuery, setSearchQuery };
};
