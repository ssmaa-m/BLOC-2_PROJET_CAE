import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { ChevronDown } from '@gravity-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useMenuDisclosure } from '../../../hooks/useMenuDisclosure';

export const UserMenu = () => {
  const navigate = useNavigate();
  const { authenticatedUser, clearUser } = useContext(UserContext);
  const { anchorEl, handleClick, handleClose } = useMenuDisclosure();
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
        data-testid="user-menu-button"
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
        {authenticatedUser?.tag}
      </Button>

      <Menu
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
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
        <MenuItem
          onClick={() => {
            navigate(`/users/${authenticatedUser?.id}`);
            handleClose();
          }}
          data-testid="user-menu-profile"
        >
          <Typography variant="h5">Mon Profil</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            clearUser();
            handleClose();
          }}
          data-testid="user-menu-logout"
        >
          <Typography variant="h5" color="error">
            Se Déconnecter
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
