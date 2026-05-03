import { Stack } from '@mui/material';
import { PlayerItemSkeleton } from './PlayerItemSkeleton';

export const PlayerItemListSkeleton = () => {
  return (
    <Stack spacing="0.25rem" px="0.625rem">
      {[...Array(8)].map((_, i) => (
        <PlayerItemSkeleton key={i} />
      ))}
    </Stack>
  );
};
