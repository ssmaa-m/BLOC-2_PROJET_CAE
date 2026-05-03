import { useState, useEffect, useCallback, useRef } from 'react';
import { MemberSummaryDto } from '../../../types';
import { useMatches } from '../../../hooks/useMatches';
import { useModalController } from '../../../hooks/useModalController';

interface UseLineupModalContentProps {
  matchId: number;
  teamId: number;
  onChange: (ids: number[]) => void;
}

export const useLineupModalContent = ({
  matchId,
  teamId,
  onChange,
}: UseLineupModalContentProps) => {
  const [allMembers, setAllMembers] = useState<MemberSummaryDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { getLineup, getAvailableMembers } = useMatches();
  const { setSubtitle } = useModalController();

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [members, lineup] = await Promise.all([
          getAvailableMembers({ matchId }),
          getLineup({ matchId, teamId }),
        ]);
        if (members) setAllMembers(members);
        if (lineup) {
          const ids = lineup.players.map((p: MemberSummaryDto) => p.id);
          setSelectedIds(ids);
          onChangeRef.current(ids);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [getAvailableMembers, getLineup, matchId, teamId]);

  useEffect(() => {
    const remainingPlaces = Math.max(0, 4 - selectedIds.length);
    if (remainingPlaces > 0) {
      setSubtitle(
        `Il vous reste ${remainingPlaces} place${remainingPlaces > 1 ? 's' : ''} à définir`,
      );
    } else {
      setSubtitle('Votre équipe est prête !');
    }
  }, [selectedIds, setSubtitle]);

  const handleToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id];
      onChangeRef.current(newSelection);
      return newSelection;
    });
  }, []);

  return {
    allMembers,
    selectedIds,
    loading,
    handleToggle,
  };
};
