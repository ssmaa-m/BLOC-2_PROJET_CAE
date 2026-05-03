import {
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Divider,
  Skeleton,
  Box,
} from '@mui/material';
import { Plus } from '@gravity-ui/icons';
import { memo } from 'react';
import { ProfileInfoDto } from '../../../types';
import { UnavailabilityItem } from './UnavailabilityItem';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { unavailabilitiesModal } from '../modals/unavailabilitiesModal';
import { useUnavailabilities } from '../../../hooks/useUnavailabilities';

export const UnavailabilitiesItem = memo(
  ({
    user,
    setUser,
  }: {
    user?: ProfileInfoDto;
    setUser: React.Dispatch<React.SetStateAction<ProfileInfoDto | undefined>>;
  }) => {
    const { openModal } = useModal();
    const { setLoading } = useModalController();
    const { addUnavailability } = useUnavailabilities({ setUser });

    const handleAddUnavailability = () => {
      let selectedDates: {
        tempId: number;
        startDate: string;
        endDate: string;
      } | null = null;
      const onSelect = (
        dates: { tempId: number; startDate: string; endDate: string } | null,
      ) => {
        selectedDates = dates;
      };
      const onConfirm = async (close: () => void) => {
        if (!selectedDates) return;
        setLoading(true);
        close();
        addUnavailability(selectedDates);
      };
      openModal(
        unavailabilitiesModal({
          unavailabilities: user?.unavailabilities ?? [],
          onSelect,
          onConfirm,
        }),
      );
    };
    return (
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          padding="1.5rem 0 1rem"
        >
          <Typography variant="h4">
            {user ? (
              'Indisponibilités'
            ) : (
              <Skeleton variant="text" width="8rem" />
            )}
          </Typography>
          <Tooltip title="Ajouter une indisponibilité" placement="bottom" arrow>
            {user ? (
              <IconButton
                onClick={handleAddUnavailability}
                size="small"
                color="secondary"
                data-testid="add-unavailability-button"
              >
                <Box display="inline-flex">
                  <Plus />
                </Box>
              </IconButton>
            ) : (
              <Skeleton
                variant="rounded"
                width="2rem"
                height="2rem"
                sx={{ borderRadius: '0.75rem' }}
              />
            )}
          </Tooltip>
        </Stack>
        <Stack
          p="0.25rem 0.5rem 0.25rem 1rem"
          divider={<Divider />}
          sx={{ background: (theme) => theme.palette.background.s2 }}
          borderRadius="0.75rem"
        >
          {!user ? (
            Array.from({ length: 3 }).map((_, index) => (
              <UnavailabilityItem key={index} setUser={() => {}} />
            ))
          ) : user.unavailabilities?.length === 0 ? (
            <Stack width="100%" alignItems="center" padding="1rem">
              <Typography
                variant="h5"
                color="text.secondary"
                data-testid="no-unavailabilities-message"
              >
                Aucune indisponibilité pour le moment
              </Typography>
            </Stack>
          ) : (
            user.unavailabilities?.map((unavailability) => (
              <UnavailabilityItem
                unavailability={unavailability}
                setUser={setUser}
                key={unavailability.id}
              />
            ))
          )}
        </Stack>
      </Stack>
    );
  },
);
