import { useContext, memo } from 'react';
import { TeamDetailsInfoDto, UserSummaryDto } from '../../../types';
import { UserContext } from '../../../contexts/UserContext';
import {
  Avatar,
  Chip,
  Skeleton,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTeams } from '../../../hooks/useTeams';
import { useModalController } from '../../../hooks/useModalController';
import { excludeMemberModal } from '../modals/excludeMemberModal';
import { useModal } from '../../../hooks/useModal';

interface MembersCardProps {
  team?: TeamDetailsInfoDto;
  setTeam: React.Dispatch<React.SetStateAction<TeamDetailsInfoDto | undefined>>;
}

export const MembersCard = memo(({ team, setTeam }: MembersCardProps) => {
  const { authenticatedUser } = useContext(UserContext);
  const { setLoading } = useModalController();
  const { excludeMember } = useTeams({ setTeam });
  const { openModal } = useModal();

  const handleExclude = () => {
    let selectedMember: UserSummaryDto | null = null;

    const onSelect = (user: UserSummaryDto | null) => {
      selectedMember = user;
    };

    const onConfirm = async (close: () => void) => {
      if (!selectedMember || !team) return;
      setLoading(true);
      close();
      excludeMember(team.idTeam, selectedMember);
    };

    openModal(excludeMemberModal({ team, onSelect, onConfirm }));
  };

  return (
    <>
      <Stack
        sx={{ background: (theme) => theme.palette.background.s1 }}
        padding="1.25rem 1rem 1rem"
        borderRadius="1.5rem"
        spacing="1.25rem"
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="h4" flex={1}>
            Membres
          </Typography>

          {team?.managers?.length &&
            team.managers.some(
              (manager) => manager.id === authenticatedUser?.id,
            ) &&
            team.members.length > 1 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleExclude}
                sx={{ my: '-0.25rem' }}
                data-testid={'team-exclude-button'}
              >
                Exclure
              </Button>
            )}
        </Stack>
        <Stack gap="0.75rem" direction="row" flexWrap="wrap">
          {!team ? (
            <>
              {Array.from({ length: 4 })?.map((_, index) => (
                <Stack
                  key={index}
                  direction="row"
                  gap="0.5rem"
                  alignItems="center"
                  height="2.75rem"
                  padding="0 0.75rem"
                  sx={{
                    background: (theme) => theme.palette.background.s2,
                  }}
                  borderRadius="0.75rem"
                >
                  <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
                  <Skeleton
                    variant="text"
                    width={`${4 + (index % 3) * 1.5}rem`}
                    height={22}
                  />
                </Stack>
              ))}
            </>
          ) : team.members ? (
            team.members.map((member) => (
              <Chip
                size="large"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    background: (theme) => theme.palette.background.s4,
                  },
                }}
                key={member.id}
                component={Link}
                to={`/users/${member.id}`}
                label={member.tag}
                avatar={<Avatar src={`/assets/avatars/${member.avatar}`} />}
                variant={
                  member.id === authenticatedUser?.id ? 'active' : 'filled'
                }
              />
            ))
          ) : (
            <Stack
              padding="1rem 1.5rem"
              spacing="0.25rem"
              alignItems="center"
              width="100%"
            >
              <Typography variant="h5" textAlign="center">
                Aucun membre
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                width="14rem"
                color="text.secondary"
              >
                Rien à signaler !
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
});
