import {
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { formatDate, getDurationString } from '../../../utils/date';
import { ArrowRight, TrashBin } from '@gravity-ui/icons';
import dayjs from 'dayjs';
import { ProfileInfoDto } from '../../../types';
import { useUnavailabilities } from '../../../hooks/useUnavailabilities';

export const UnavailabilityItem = ({
  unavailability,
  setUser,
}: {
  unavailability?: { id: number; startDate: string; endDate: string };
  setUser: React.Dispatch<React.SetStateAction<ProfileInfoDto | undefined>>;
}) => {
  const { deleteUnavailability } = useUnavailabilities({ setUser });
  const theme = useTheme();

  if (!unavailability)
    return (
      <Stack
        direction="row"
        spacing="0.375rem"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: (theme) => theme.palette.background.s2,
          '&:last-of-type': {
            borderRadius: '0.375rem 0.375rem 0.75rem 0.75rem',
          },
          '&:first-of-type': {
            borderRadius: '0.75rem 0.75rem 0.375rem 0.375rem',
          },
          '&:only-of-type': {
            borderRadius: '0.75rem 0.75rem 0.75rem 0.75rem',
          },
        }}
        padding="0.375rem 0.5rem 0.375rem 1rem"
      >
        <Stack direction="row" alignItems="center" spacing="0.5rem">
          <Skeleton variant="text" width="5rem" height={22} />
          <Skeleton variant="circular" width="1rem" height="1rem" />
          <Skeleton variant="text" width="5rem" height={22} />
        </Stack>
        <Skeleton
          variant="rounded"
          sx={{ borderRadius: '0.375rem' }}
          width="2rem"
          height="2rem"
        />
      </Stack>
    );

  return (
    <Stack
      direction="row"
      spacing="0.375rem"
      alignItems="center"
      justifyContent="space-between"
      padding="0.375rem 0"
    >
      <Tooltip
        title={getDurationString({
          startDate: dayjs(unavailability.startDate),
          endDate: dayjs(unavailability.endDate),
        })}
        arrow
        placement="right"
      >
        <Stack direction="row" alignItems="center" spacing="0.5rem">
          <Typography color="secondary" variant="body1">
            {formatDate(unavailability.startDate)}
          </Typography>
          <ArrowRight
            style={{
              color: theme.palette.text.secondary,
              width: '1rem',
              height: '1rem',
            }}
          />
          <Typography color="secondary" variant="body1">
            {formatDate(unavailability.endDate)}
          </Typography>
        </Stack>
      </Tooltip>
      <Tooltip
        title={
          unavailability.id < 0
            ? 'En cours de création...'
            : "Supprimer l'indisponibilité"
        }
        placement="left"
        arrow
      >
        <IconButton
          loading={unavailability.id < 0}
          size="small"
          onClick={() =>
            unavailability.id >= 0 && deleteUnavailability(unavailability)
          }
        >
          <TrashBin
            style={{
              color:
                unavailability.id < 0
                  ? 'transparent'
                  : theme.palette.text.secondary,
            }}
          />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
