import { Avatar, Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { FullTeamDto } from '../../../types';
import { Link } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';
import { TeamItemSkeleton } from './TeamItemSkeleton';

interface TeamItemProps {
  team?: FullTeamDto;
}

export const TeamItem = ({ team }: TeamItemProps) => {
  if (!team) return <TeamItemSkeleton />;

  return (
    <Stack
      component={Link}
      to={`/teams/${team.idTeam}`}
      borderRadius="0.75rem"
      sx={{
        background: (theme) => theme.palette.background.s1,
        textDecoration: 'none',
      }}
      overflow="hidden"
      border="1px solid"
      borderColor="divider"
    >
      <Tooltip
        title={
          <MembersPopup
            members={team.members}
            managerId1={team.managerId1}
            managerId2={team.managerId2}
          />
        }
        arrow
        disableHoverListener={team.members.length === 0}
        disableFocusListener={team.members.length === 0}
        disableTouchListener={team.members.length === 0}
      >
        <Box>
          <Stack
            py="0.75rem"
            alignItems="center"
            sx={{ background: (theme) => theme.palette.background.s2 }}
          >
            <Typography variant="h5">{team.name}</Typography>
          </Stack>
          <Stack
            padding="0.25rem 0.25rem 0.25rem 0.625rem"
            alignItems="center"
            direction="row"
          >
            <Typography
              variant="h6"
              color="secondary"
              flex="1"
              lineHeight="1.375rem"
            >
              {team.members.length} membre{team.members.length !== 1 ? 's' : ''}
            </Typography>
            <Chip
              size="small"
              sx={{ height: '1.375rem' }}
              color={team.isActive ? 'primary' : 'secondary'}
              label={team.isActive ? 'Active' : 'Inactive'}
            />
          </Stack>
        </Box>
      </Tooltip>
    </Stack>
  );
};

const MembersPopup = ({
  members,
  managerId1,
  managerId2,
}: {
  members: FullTeamDto['members'];
  managerId1: FullTeamDto['managerId1'];
  managerId2: FullTeamDto['managerId2'];
}) => {
  const { authenticatedUser } = useUser();

  const isManager = (memberId: number) =>
    memberId === managerId1 || memberId === managerId2;
  const isAuthenticatedMember = (memberId: number) =>
    memberId === authenticatedUser?.id;
  return (
    <Stack
      direction="row"
      rowGap="0.625rem"
      columnGap="0.5rem"
      padding="0.5rem 0"
      flexWrap="wrap"
    >
      {members.map((member) => (
        <Chip
          size="medium"
          sx={{
            cursor: 'pointer',
            border: (theme) =>
              isManager(member.id) ? `2px solid ${theme.palette.divider}` : '',
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
          variant={isAuthenticatedMember(member.id) ? 'active' : 'filled'}
        />
      ))}
    </Stack>
  );
};
