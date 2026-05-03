import { Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { TeamSummaryDto } from '../../../types';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { registrationManagementModal } from '../modals/registrationManagementModal';

export const TeamsCard = ({
  teams,
  capacity,
  status,
  managedTeamId,
  tournamentId,
  onRegister,
}: {
  teams?: TeamSummaryDto[];
  capacity?: number;
  status?: string;
  managedTeamId?: number;
  tournamentId?: number;
  onRegister?: (id: number) => void;
}) => {
  const { openModal } = useModal();
  const { setLoading } = useModalController();

  const isUserTeamRegistered = useMemo(() => {
    if (!managedTeamId || !teams) return false;
    return teams.some((t) => t.idTeam === managedTeamId);
  }, [managedTeamId, teams]);

  const onAction = (register: boolean) => {
    const handleRegister = async (close: () => void) => {
      if (tournamentId && onRegister) {
        setLoading(true);
        await onRegister(tournamentId);
      }
      close();
    };
    const handleUnregister = (close: () => void) => {
      console.log('unregister');
      close();
    };
    openModal(
      registrationManagementModal({
        onConfirm: register ? handleRegister : handleUnregister,
        register,
      }),
    );
  };

  return (
    <Stack
      sx={{ background: (theme) => theme.palette.background.s1 }}
      padding="1.25rem 1rem 1rem"
      borderRadius="1.5rem"
      spacing="1.25rem"
    >
      <Stack direction="row" alignItems="center">
        <Stack direction="row" gap="0.75rem" flex={1} alignItems="baseline">
          <Typography variant="h4">
            {teams ? (
              'Teams participantes'
            ) : (
              <Skeleton variant="text" width="10rem" />
            )}
          </Typography>
          {capacity && (
            <Typography
              variant="h5"
              color="text.secondary"
              data-testid="tournament-capacity-display"
            >
              {teams?.length || 0}/{capacity}
            </Typography>
          )}
        </Stack>
        {managedTeamId &&
          (teams && capacity ? (
            capacity > (teams?.length || 0) &&
            status === 'REGISTRATION_OPEN' && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ my: '-0.25rem' }}
                onClick={() => onAction(!isUserTeamRegistered)}
                data-testid="tournament-register-button"
              >
                {isUserTeamRegistered ? 'Se retirer' : "S'inscrire"}
              </Button>
            )
          ) : (
            <Skeleton
              variant="rounded"
              width="6rem"
              height="2rem"
              sx={{ borderRadius: '0.75rem', my: '-0.25rem' }}
            />
          ))}
      </Stack>
      <Stack gap="0.75rem" direction="row" flexWrap="wrap">
        {teams ? (
          teams.length > 0 ? (
            teams.map((team) => (
              <Chip
                size="large"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    background: (theme) => theme.palette.background.s4,
                  },
                }}
                key={team.idTeam}
                component={Link}
                to={`/teams/${team.idTeam}`}
                label={team.name}
                variant="filled"
              />
            ))
          ) : (
            <Stack
              padding="2rem 1.5rem"
              spacing="0.25rem"
              alignItems="center"
              width="100%"
              sx={{
                background: (theme) => theme.palette.background.s2,
              }}
              borderRadius="0.75rem"
            >
              <Typography variant="h5" textAlign="center">
                Aucune équipe inscrite
              </Typography>
              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
              >
                Il n'y a pas encore d'équipes enregistrées pour ce tournoi.
              </Typography>
            </Stack>
          )
        ) : (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
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
