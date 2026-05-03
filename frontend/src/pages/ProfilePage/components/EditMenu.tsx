import { Dispatch, SetStateAction } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { ChevronDown } from '@gravity-ui/icons';
import { ProfileInfoDto, SpecialtyDto } from '../../../types';
import { useModal } from '../../../hooks/useModal';
import { useModalController } from '../../../hooks/useModalController';
import { useMembers } from '../../../hooks/useMembers';
import { changePasswordModal } from '../modals/changePasswordModal';
import { changeSpecialtyModal } from '../modals/changeSpecialtyModal';
import { useMenuDisclosure } from '../../../hooks/useMenuDisclosure';

export const EditMenu = ({
  user,
  setUser,
}: {
  user: ProfileInfoDto;
  setUser: Dispatch<SetStateAction<ProfileInfoDto | undefined>>;
}) => {
  const { anchorEl, handleClick, handleClose } = useMenuDisclosure();
  const { openModal } = useModal();
  const { setLoading } = useModalController();
  const { updatePassword, updateSpecialty } = useMembers({ setUser });

  const handlePasswordChange = () => {
    handleClose();
    let selectedPassword: string | null = null;
    const onSelect = (pwd: string | null) => {
      selectedPassword = pwd;
    };
    const onConfirm = async (close: () => void) => {
      if (!selectedPassword) return;
      setLoading(true);
      await updatePassword(selectedPassword);
      close();
    };
    openModal(changePasswordModal({ onSelect, onConfirm }));
  };

  const handleSpecialtyChange = () => {
    handleClose();
    let selectedSpecialty: SpecialtyDto | null = null;
    const onSelect = (spec: SpecialtyDto | null) => {
      selectedSpecialty = spec;
    };
    const onConfirm = async (close: () => void) => {
      if (!user || !selectedSpecialty) return;
      setLoading(true);
      close();
      updateSpecialty(selectedSpecialty, user.specialty ?? '');
    };
    openModal(
      changeSpecialtyModal({
        onSelect,
        onConfirm,
        currentSpecialty: user.specialty ?? '',
      }),
    );
  };

  return (
    <>
      <Button
        data-testid="profile-edit-button"
        variant="contained"
        color="secondary"
        onClick={handleClick}
        endIcon={
          <ChevronDown
            style={{
              color: 'text.secondary',
              transition: 'rotate 0.2s cubic-bezier(0.2, 0, 0, 1)',
              rotate: anchorEl ? '180deg' : '0deg',
            }}
          />
        }
      >
        Modifier
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: 'fit-content',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handlePasswordChange}>
          <Typography variant="h5" data-testid="edit-menu-password">
            Modifier le Mot de passe
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSpecialtyChange}>
          <Typography variant="h5" data-testid="edit-menu-specialty">
            Modifier la Spécialité
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
