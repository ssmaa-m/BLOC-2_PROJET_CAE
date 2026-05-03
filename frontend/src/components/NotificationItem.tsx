import {
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import { NotificationDto } from '../types';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Check } from '@gravity-ui/icons';
import { formatRelativeTime } from '../utils/date';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationContext } from '../contexts/NotificationContext';

interface Props {
  notification: NotificationDto;
}

export const NotificationItem = ({ notification }: Props) => {
  const { authenticatedUser } = useContext(UserContext);
  const { handleNotificationClick } = useContext(NotificationContext);
  const { markAsRead } = useNotifications();

  // Logic: Only clickable if it has a reference ID
  const isClickable = !!notification.idReference;

  if (!authenticatedUser) return null;

  const contentParts = notification.content.split('\n');
  const title = contentParts[0];
  const description =
    contentParts.length > 1 ? contentParts.slice(1).join('\n') : null;

  return (
    <ListItem
      //  only trigger if there is a destination
      onClick={
        isClickable ? () => handleNotificationClick(notification) : undefined
      }
      sx={{
        alignItems: 'center',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: (theme) =>
          notification.isRead ? 'transparent' : theme.palette.background.s3,
        cursor: isClickable ? 'pointer' : undefined,
        '&:hover': {
          backgroundColor: (theme) =>
            isClickable && !notification.isRead
              ? theme.palette.background.s4
              : isClickable && notification.isRead
                ? theme.palette.background.s3
                : undefined,
        },
      }}
      secondaryAction={
        !notification.isRead && (
          <Tooltip title="Marquer comme lu" placement="left" arrow>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                // stops bubbling
                e.stopPropagation();
                markAsRead(notification.idNotification);
              }}
              data-testid="notification-mark-as-read"
            >
              <Check />
            </IconButton>
          </Tooltip>
        )
      }
    >
      <ListItemText
        disableTypography
        primary={
          <Typography
            variant="h5"
            color="text.primary"
            fontWeight={400}
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        }
        secondary={
          <>
            {description && (
              <Stack
                padding="0.375rem 0.5rem"
                borderRadius="0.375rem"
                border={(theme) => `1px solid ${theme.palette.divider}`}
                mt="0.5rem"
                width="fit-content"
                maxWidth="100%"
              >
                <Typography variant="h6" color="text.primary" fontWeight={400}>
                  {description}
                </Typography>
              </Stack>
            )}
            <Typography variant="h6" color="text.secondary" mt="0.5rem">
              {formatRelativeTime(notification.dateTime)}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};
