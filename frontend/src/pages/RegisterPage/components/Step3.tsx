import { Avatar, ButtonBase, Stack } from '@mui/material';
import { ProfilePicture } from '../../../types';

interface Step3Props {
  chosenImage: ProfilePicture | null;
  handleAvatarClick: () => void;
}

export const Step3 = ({ chosenImage, handleAvatarClick }: Step3Props) => {
  return (
    <Stack alignItems="center">
      <ButtonBase
        onClick={handleAvatarClick}
        autoFocus
        sx={{
          borderRadius: '100rem',
          '&:focus-visible': {
            outline: '2px solid',
            outlineOffset: '4px',
            outlineColor: 'primary.main',
          },
        }}
      >
        <Avatar
          className="profile-picture-placeholder"
          src={chosenImage ? `/assets/avatars/${chosenImage.path}` : ''}
          sx={{
            width: 100,
            height: 100,
            cursor: 'pointer',
          }}
        />
      </ButtonBase>
    </Stack>
  );
};
