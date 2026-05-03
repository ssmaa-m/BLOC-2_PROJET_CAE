import { Avatar, ImageList, ImageListItem, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import { ProfilePicture } from '../types';
import { useProfilePictures } from '../hooks/useProfilePictures';
import { useModalController } from '../hooks/useModalController';

interface Props {
  onSelect: (image: ProfilePicture) => void;
}

export const ProfilePictureModalContent = ({ onSelect }: Props) => {
  const { setConfirmDisabled } = useModalController();
  const { profilePictures, getAll, isGettingProfilePictures } =
    useProfilePictures();
  const [avatar, setAvatar] = useState<ProfilePicture | null>(null);

  useEffect(() => {
    getAll();
  }, [getAll]);
  return (
    <ImageList cols={4} gap={10}>
      {isGettingProfilePictures
        ? Array.from({ length: 20 }).map((_, i) => (
            <ImageListItem key={i}>
              <Skeleton
                variant="circular"
                width="100%"
                height="100%"
                sx={{ aspectRatio: '1' }}
              />
            </ImageListItem>
          ))
        : profilePictures.map((icon) => (
            <ImageListItem
              key={icon.idImage}
              onClick={() => {
                setAvatar(icon);
                onSelect(icon);
                setConfirmDisabled(false);
              }}
              sx={{
                cursor: 'pointer',
                outlineOffset: '-0.25rem',
                outline: (theme) =>
                  avatar?.idImage === icon.idImage
                    ? `0.25rem solid ${theme.palette.primary.main}`
                    : 'none',
                borderRadius: '100rem',
                overflow: 'hidden',
                aspectRatio: '1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                data-testid={`avatar-option-${icon.path}`}
                sx={{
                  width: 'calc(100% - 0.5rem)',
                  height: 'calc(100% - 0.5rem)',
                  flexShrink: 0,
                }}
                src={`/assets/avatars/${icon.path}`}
                alt="avatar"
              />
            </ImageListItem>
          ))}
    </ImageList>
  );
};
