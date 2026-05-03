import { Avatar, Chip, Skeleton, Stack, Typography, Box } from '@mui/material';
import { Pencil } from '@gravity-ui/icons';
import { Dispatch, SetStateAction } from 'react';
import { ProfileInfoDto, ProfilePicture } from '../../../types';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { useMembers } from '../../../hooks/useMembers';
import { profilePictureModal } from '../../../modals/profilePictureModal';
import { formatDate } from '../../../utils/date';
import { EditMenu } from './EditMenu';

interface PersonalInfoItemProps {
  user?: ProfileInfoDto;
  setUser: Dispatch<SetStateAction<ProfileInfoDto | undefined>>;
}

export const PersonalInfoItem = ({ user, setUser }: PersonalInfoItemProps) => {
  const { openModal } = useModal();
  const { setLoading } = useModalController();
  const { updateAvatar } = useMembers({
    setUser,
  });

  const handleAvatarChange = () => {
    let selectedImage: ProfilePicture | null = null;
    const onSelect = (image: ProfilePicture | null) => {
      selectedImage = image;
    };
    const onConfirm = async (close: () => void) => {
      if (!user || !selectedImage) return;
      const previousAvatar = user.avatar;
      if (previousAvatar === selectedImage.path) return;
      setLoading(true);
      close();
      updateAvatar(selectedImage, previousAvatar ?? '');
    };
    openModal(profilePictureModal({ onSelect, onConfirm }));
  };

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Box
          onClick={user ? handleAvatarChange : undefined}
          data-testid="profile-avatar-clickable"
          sx={{
            position: 'relative',
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '100rem',
            overflow: 'hidden',
            cursor: 'pointer',
            outline: '2px solid',
            outlineColor: 'background.s3',
            padding: '0.375rem',
            '&:hover .avatar-overlay': {
              opacity: 1,
            },
          }}
        >
          {user ? (
            <>
              <Avatar
                data-testid="profile-avatar-image"
                src={user.avatar ? `/assets/avatars/${user.avatar}` : undefined}
                sx={{
                  width: '2rem',
                  height: '2rem',
                }}
              />
              <Stack
                className="avatar-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Pencil style={{ color: 'white', fontSize: '1.5rem' }} />
              </Stack>
            </>
          ) : (
            <Skeleton variant="circular" width="2rem" height="2rem" />
          )}
        </Box>

        {user ? (
          <EditMenu
            user={user}
            setUser={setUser}
            data-testid="profile-edit-menu"
          />
        ) : (
          <Skeleton
            variant="rounded"
            width="6.875rem"
            height="2rem"
            sx={{ borderRadius: '0.75rem' }}
            data-testid="profile-menu-skeleton"
          />
        )}
      </Stack>
      <Stack padding="2rem 0 1.5rem" spacing="0.5rem">
        <Typography variant="h2">
          {user ? (
            user.tag
          ) : (
            <Skeleton variant="text" height="2rem" width="10rem" />
          )}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {user ? user.email : <Skeleton variant="text" width="14rem" />}
        </Typography>
        <Stack direction="row" spacing="0.75rem" alignItems="center">
          {user?.specialty ? (
            <Chip
              data-testid="profile-specialty-display"
              label={
                user.specialty.charAt(0).toUpperCase() + user.specialty.slice(1)
              }
              color="primary"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Skeleton
              variant="rounded"
              height="1.75rem"
              width="6rem"
              sx={{ borderRadius: '100rem' }}
            />
          )}
          <Typography variant="h5" color="text.secondary">
            {user ? (
              `Créé le ${formatDate(user.creationDate ?? '')}`
            ) : (
              <Skeleton variant="text" width="8rem" />
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
