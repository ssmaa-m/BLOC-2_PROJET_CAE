import {
  Avatar,
  Stack,
  Typography,
  Skeleton,
  Chip,
  Button,
} from '@mui/material';
import { UserSummaryDto, TeamDetailsInfoDto } from '../../../types';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { managerModal } from '../modals/managerModal';
import { useTeams } from '../../../hooks/useTeams';
import { resignManagerModal } from '../modals/resignManagerModal';

export const ManagerCard = ({
  team,
  setTeam,
}: {
  team?: TeamDetailsInfoDto;
  setTeam: React.Dispatch<React.SetStateAction<TeamDetailsInfoDto | undefined>>;
}) => {
  const { authenticatedUser } = useContext(UserContext);
  const { openModal } = useModal();
  const { setLoading } = useModalController();
  const { promoteToManager, resignManager } = useTeams({ setTeam });

  const handlePromote = () => {
    let selectedManager: UserSummaryDto | null = null;

    const onSelect = (user: UserSummaryDto | null) => {
      selectedManager = user;
    };

    const onConfirm = async (close: () => void) => {
      if (!selectedManager || !team) return;
      setLoading(true);
      close();
      promoteToManager(team.idTeam, selectedManager);
    };

    openModal(managerModal({ team, onSelect, onConfirm }));
  };

  const handleResign = async () => {
    const onConfirm = async (close: () => void) => {
      if (!team || team.managers.length < 2) return;
      setLoading(true);
      close();
      resignManager(team.idTeam);
    };
    openModal(resignManagerModal({ onConfirm }));
  };

  return (
    <Stack
      sx={{ background: (theme) => theme.palette.background.s1 }}
      padding="1.25rem 1rem 1rem"
      borderRadius="1.5rem"
      spacing="1.25rem"
    >
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" flex={1}>
          Responsables
        </Typography>
        {team?.managers?.length &&
          team.managers.some(
            (manager) => manager.id === authenticatedUser?.id,
          ) &&
          team.members.length > 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={team.managers.length < 2 ? handlePromote : handleResign}
              sx={{ my: '-0.25rem' }}
              data-testid={
                team.managers.length < 2
                  ? 'team-promote-button'
                  : 'team-resign-button'
              }
            >
              {team.managers.length < 2 ? 'Désigner' : 'Renoncer'}
            </Button>
          )}
      </Stack>
      <Stack gap="0.75rem" direction="row" flexWrap="wrap">
        {team ? (
          team?.managers?.map((manager) => (
            <Chip
              size="large"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  background: (theme) => theme.palette.background.s4,
                },
              }}
              key={manager.id}
              component={Link}
              to={`/users/${manager.id}`}
              label={manager.tag}
              avatar={<Avatar src={`/assets/avatars/${manager.avatar}`} />}
              variant={
                manager.id === authenticatedUser?.id ? 'active' : 'filled'
              }
            />
          ))
        ) : (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
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
        )}
      </Stack>
    </Stack>
  );
};
