import { Avatar, Checkbox, Stack, Typography } from '@mui/material';
import { MemberSummaryDto } from '../../../types';
interface PlayerItemProps {
  player: MemberSummaryDto;
  isSelected: boolean;
  onToggle: () => void;
}

export const PlayerItem = ({
  player,
  isSelected,
  onToggle,
}: PlayerItemProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="1rem"
      height="4.25rem"
      onClick={onToggle}
      sx={{
        cursor: 'pointer',
        borderRadius: '0.75rem',
        px: '0.875rem',
        backgroundColor: (theme) =>
          isSelected ? theme.palette.background.s2 : 'transparent',
        transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: (theme) =>
            isSelected
              ? theme.palette.background.s3
              : theme.palette.background.s2,
        },
      }}
    >
      <Avatar
        src={player.avatar ? `/assets/avatars/${player.avatar}` : undefined}
        alt={player.tag}
      >
        {player.tag}
      </Avatar>

      <Stack flex={1}>
        <Typography variant="h5" sx={{ userSelect: 'none' }}>
          {player.tag}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {player.specialty
            ? player.specialty.charAt(0).toUpperCase() +
              player.specialty.slice(1)
            : 'Aucune spécialité'}
        </Typography>
      </Stack>
      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        sx={{ color: 'primary.main', pointerEvents: 'none' }}
      />
    </Stack>
  );
};
