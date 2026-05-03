import { MemberSummaryDto } from '../../../types';
import { Stack } from '@mui/material';
import { PlayerItem } from '../components/PlayerItem';
import { PlayerItemListSkeleton } from '../components/PlayerItemListSkeleton';
import { useLineupModalContent } from '../hooks/useLineupModalContent';

interface LineupModalContentProps {
  matchId: number;
  teamId: number;
  onChange: (ids: number[]) => void;
}

export const LineupModalContent = ({
  matchId,
  teamId,
  onChange,
}: LineupModalContentProps) => {
  const { allMembers, selectedIds, loading, handleToggle } =
    useLineupModalContent({ matchId, teamId, onChange });

  if (loading) return <PlayerItemListSkeleton />;

  return (
    <Stack spacing="0.25rem" px="0.625rem">
      {allMembers.map((member: MemberSummaryDto) => {
        const isSelected = selectedIds.includes(member.id);
        // block toggle if there are already 4 members and its not a member we are trying to unselect
        const isFull = selectedIds.length >= 4 && !isSelected;

        return (
          <PlayerItem
            key={member.id}
            player={member}
            isSelected={isSelected}
            // if full toggle has no effect
            onToggle={() => !isFull && handleToggle(member.id)}
          />
        );
      })}
    </Stack>
  );
};
