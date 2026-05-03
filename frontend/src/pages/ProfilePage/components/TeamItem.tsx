import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Plus, ArrowRight } from '@gravity-ui/icons';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileInfoDto, Team } from '../../../types';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { createTeamModal } from '../modals/createTeamModal';
import { joinTeamModal } from '../modals/joinTeamModal';
import { quitConfirmationModal } from '../modals/quitConfirmationModal';
import { useTeams } from '../../../hooks/useTeams';
import { useJoinRequests } from '../../../hooks/useJoinRequests';

interface TeamItemProps {
  user?: ProfileInfoDto;
  setUser: Dispatch<SetStateAction<ProfileInfoDto | undefined>>;
}

export const TeamItem = ({ user, setUser }: TeamItemProps) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { setLoading } = useModalController();
  const { createTeam, quitTeam } = useTeams({ setUser });
  const { createJoinRequest } = useJoinRequests();

  const handleJoin = () => {
    let selectedTeam: Team | null = null;
    const onSelect = (team: Team | null) => {
      selectedTeam = team;
    };
    const onConfirm = async (close: () => void) => {
      const idTeam = selectedTeam?.idTeam;
      if (!idTeam) return;
      setLoading(true);
      await createJoinRequest(idTeam);
      close();
    };
    openModal(joinTeamModal({ onSelect, onConfirm }));
  };

  const handleCreate = () => {
    let selectedName: string | null = null;
    const onSelect = (name: string | null) => {
      selectedName = name;
    };
    const onConfirm = async (close: () => void) => {
      if (!selectedName) return;
      setLoading(true);
      const createdTeam = await createTeam(selectedName);

      if (createdTeam) {
        close();
      } else {
        setLoading(false);
      }
    };
    openModal(createTeamModal({ onSelect, onConfirm }));
  };

  const handleViewTeam = () => {
    if (user?.team) {
      navigate(`/teams/${user.team.id}`);
    }
  };

  const handleQuit = () => {
    if (!user?.team) return;

    const onConfirm = async (close: () => void) => {
      setLoading(true);
      await quitTeam();
      close();
    };

    openModal(
      quitConfirmationModal({
        onConfirm,
        state:
          user.team.manager && !user.team.hasOtherManager
            ? user.team.membersCount > 1
              ? 'MANAGER_BLOCKED'
              : 'DISSOLVE'
            : 'NORMAL',
      }),
    );
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      padding="1.25rem 0"
    >
      <Stack>
        <Typography variant="h6" color="text.secondary">
          {user ? 'Votre Team' : <Skeleton variant="text" width="6rem" />}
        </Typography>
        <Typography
          variant="h4"
          color={user?.team ? 'text.primary' : 'text.secondary'}
          data-testid="team-name-display"
        >
          {user ? (
            user.team ? (
              user.team.name
            ) : (
              'Aucune team'
            )
          ) : (
            <Skeleton variant="text" width="10rem" />
          )}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {!user ? (
          <>
            <Skeleton
              data-testid="team-button-skeleton"
              variant="rounded"
              width="6rem"
              height="2rem"
              sx={{ borderRadius: '0.75rem' }}
            />
            <Skeleton
              variant="rounded"
              width="2rem"
              height="2rem"
              sx={{ borderRadius: '0.75rem' }}
            />
          </>
        ) : (
          <>
            <Button
              onClick={user.team ? handleQuit : handleJoin}
              variant="contained"
              color="secondary"
              data-testid={user.team ? 'team-quit-button' : 'team-join-button'}
            >
              {user.team ? 'Quitter' : 'Rejoindre'}
            </Button>
            <Tooltip
              title={user.team ? 'Voir la team' : 'Créer une team'}
              arrow
              placement="bottom"
            >
              <IconButton
                onClick={user.team ? handleViewTeam : handleCreate}
                color="secondary"
                size="small"
                data-testid={
                  user.team ? 'team-view-button' : 'team-create-button'
                }
              >
                <Box display="inline-flex">
                  {user.team ? <ArrowRight /> : <Plus />}
                </Box>
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Stack>
  );
};
