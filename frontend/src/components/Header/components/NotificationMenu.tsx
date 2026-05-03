import { useState, MouseEvent } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { NotificationItem } from '../../NotificationItem';
import { Bell } from '@gravity-ui/icons';
import { useNotifications } from '../../../hooks/useNotifications';

export const NotificationMenu = () => {
  const [menuPosition, setMenuPosition] = useState<null | HTMLElement>(null);
  const { unreadNotifications, unreadCount, getAll } = useNotifications();

  const isOpen = menuPosition != null;

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuPosition(event.currentTarget);
    getAll(true);
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={{
          background: (theme) =>
            isOpen ? theme.palette.background.s4 : 'transparent',
        }}
        data-testid="notification-menu-button"
      >
        <Badge
          badgeContent={unreadCount}
          color="primary"
          data-testid="notification-badge"
        >
          <Bell />
        </Badge>
      </IconButton>

      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorEl={menuPosition}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: '25rem',
              marginTop: '0.375rem',
            },
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            gap: 0,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          minWidth="15rem"
          padding="0.75rem 1rem 0.75rem 1rem"
          sx={{
            outline: 'none',
          }}
        >
          <Typography variant="h4">Notifications</Typography>
          <Button
            component={Link}
            to="/notifications"
            onClick={handleClose}
            variant="contained"
            color="secondary"
            size="small"
            data-testid="notification-view-all-button"
          >
            Voir Tout
          </Button>
        </Stack>

        <Divider />

        {unreadNotifications.length === 0 ? (
          <Stack padding="2rem 1.5rem" spacing="0.25rem" alignItems="center">
            <Typography
              variant="h5"
              textAlign="center"
              data-testid="notifications-empty-state"
            >
              Rien à signaler !
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              width="14rem"
              color="text.secondary"
            >
              Vous n'avez aucune nouvelle notification pour le moment.
            </Typography>
          </Stack>
        ) : (
          <Stack divider={<Divider />} data-testid="notification-list">
            {unreadNotifications.map((notif) => (
              <NotificationItem
                key={notif.idNotification}
                notification={notif}
                data-testid="notification-item"
              />
            ))}
          </Stack>
        )}
      </Menu>
    </>
  );
};
