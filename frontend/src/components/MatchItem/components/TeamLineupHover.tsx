import { Avatar, Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import {
  matchStatus,
  MatchTeamDto,
  MaybeAuthenticatedUser,
} from '../../../types';
import { Link } from 'react-router-dom';

interface TeamLineupHoverProps {
  team: MatchTeamDto;
  matchStatus: matchStatus;
  authenticatedUser: MaybeAuthenticatedUser;
  children: React.ReactNode;
}

export const TeamLineupHover = ({
  team,
  matchStatus,
  authenticatedUser,
  children,
}: TeamLineupHoverProps) => {
  const isPlanned = matchStatus === 'PLANNED';
  const isInProgress = matchStatus === 'IN_PROGRESS';
  const isTeammate = authenticatedUser?.teamId === team.idTeam;
  const isAdmin = !!authenticatedUser?.admin;

  const canSee = (!isPlanned && !isInProgress) || isTeammate || isAdmin;

  // if not allowed to see no tooltip
  if (!canSee) {
    return <>{children}</>;
  }

  // if can see check if there are player to show
  const hasPlayers = team.lineup?.players && team.lineup.players.length > 0;

  const lineupContent = (
    <Stack
      direction="row"
      rowGap="0.625rem"
      columnGap="0.5rem"
      padding="0.25rem"
      flexWrap="wrap"
      maxWidth="16rem"
    >
      {hasPlayers ? (
        team.lineup?.players?.map((member) => (
          <Chip
            size="medium"
            sx={{
              cursor: 'pointer',
              border: (theme) =>
                authenticatedUser?.id === member.id
                  ? `2px solid ${theme.palette.primary.main}`
                  : '',
              '&:hover': {
                background: (theme) => theme.palette.background.s4,
              },
            }}
            key={member.id}
            component={Link}
            to={`/users/${member.id}`}
            label={member.tag}
            avatar={
              <Avatar
                sx={{ height: '1rem !important', width: '1rem !important' }}
                src={`/assets/avatars/${member.avatar}`}
              />
            }
            variant={authenticatedUser?.id === member.id ? 'active' : 'filled'}
          />
        ))
      ) : (
        <Typography variant="caption" color="text.secondary">
          Non définie
        </Typography>
      )}
    </Stack>
  );

  return (
    <Tooltip title={lineupContent} placement="top" arrow>
      <Box>{children}</Box>
    </Tooltip>
  );
};
