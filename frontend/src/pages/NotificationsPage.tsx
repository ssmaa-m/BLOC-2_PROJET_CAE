import { Container, Divider, List, Stack, Typography } from '@mui/material';
import { NotificationItem } from '../components/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationsPage = () => {
  const { allNotifications: notifications } = useNotifications();
  return (
    <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
      <Typography variant="h4" pb="1rem">
        Historique des notifications
      </Typography>
      <List
        sx={{
          p: 0,
          background: (theme) => theme.palette.background.s1,
          borderRadius: '1.5rem',
          overflow: 'hidden',
        }}
      >
        {notifications.length === 0 ? (
          <Stack
            padding="3rem 1.5rem"
            spacing="0.25rem"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h5" textAlign="center">
              Rien à signaler!
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              width="14rem"
              color="text.secondary"
            >
              Vous n'avez aucune notification pour le moment.
            </Typography>
          </Stack>
        ) : (
          <Stack divider={<Divider />} padding="0.5rem 0">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.idNotification}
                notification={notif}
              />
            ))}
          </Stack>
        )}
      </List>
    </Container>
  );
};
