import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { NotificationDto } from '../types';
import { useApi } from '../hooks/useApi';
import { UserContext } from './UserContext';
import { useSnackbar } from '../hooks/useSnackbar';
import { useLocation, useNavigate } from 'react-router-dom';

interface NotificationContextProps {
  allNotifications: NotificationDto[];
  unreadNotifications: NotificationDto[];
  unreadCount: number;
  markAsRead: (idNotification: number) => void;
  getAll: (unreadOnly?: boolean) => void;
  getUnreadCount: () => void;
  handleNotificationClick: (notification: NotificationDto) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  allNotifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  getAll: () => {},
  getUnreadCount: () => {},
  handleNotificationClick: () => {},
});

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [allNotifications, setAllNotifications] = useState<NotificationDto[]>(
    [],
  );
  const [unreadNotifications, setUnreadNotifications] = useState<
    NotificationDto[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { authenticatedUser } = useContext(UserContext);
  const { showSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const isNotificationPage = pathname === '/notifications';
  const navigate = useNavigate();

  const { execute: getAll } = useApi(
    async (unreadOnly: boolean = false) => {
      const response = await fetch(
        `/api/notifications/member/me?unreadOnly=${unreadOnly}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );
      if (!response.ok)
        throw new Error('Échec de la récupération des notifications.');
      return response.json();
    },
    {
      onSuccess: (data, params) => {
        if (params) setUnreadNotifications(data);
        else setAllNotifications(data);
      },
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la récupération des notifications.',
          severity: 'error',
        }),
    },
  );

  const { execute: getUnreadCount } = useApi(
    async () => {
      const response = await fetch(
        `/api/notifications/member/me/unread-count`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );
      if (!response.ok)
        throw new Error('Échec de la récupération du nombre de notifications.');
      return response.json();
    },
    {
      onSuccess: (data) => setUnreadCount(data),
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la récupération du nombre de notifications.',
          severity: 'error',
        }),
    },
  );

  const { execute: markAsRead } = useApi(
    async (idNotification: number) => {
      const response = await fetch(
        `/api/notifications/${idNotification}/read`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authenticatedUser?.token ?? '',
          },
        },
      );
      if (!response.ok)
        throw new Error(
          'Échec de la mise à jour du statut de la notification.',
        );
    },
    {
      onOptimism: (idNotification) => {
        // update full List
        setAllNotifications((prev) =>
          prev.map((notif) =>
            notif.idNotification === idNotification
              ? { ...notif, isRead: true }
              : notif,
          ),
        );
        // update the unreadNotifs instantly
        setUnreadNotifications((prev) =>
          prev.filter((notif) => notif.idNotification !== idNotification),
        );
        // set unread count to -1
        setUnreadCount((prev) => Math.max(0, prev - 1));
      },
      onRollback: (idNotification) => {
        setAllNotifications((prev) =>
          prev.map((notif) =>
            notif.idNotification === idNotification
              ? { ...notif, isRead: false }
              : notif,
          ),
        );
        setUnreadCount((prev) => prev + 1);
      },
      onSuccess: () =>
        showSnackbar({
          message: 'Notification marquée comme lue !',
          severity: 'success',
        }),
      onError: (err) =>
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la mise à jour du statut de la notification.',
          severity: 'error',
        }),
    },
  );

  useEffect(() => {
    if (authenticatedUser === undefined) return;
    if (authenticatedUser === null) {
      // init state variables
      setAllNotifications([]);
      setUnreadNotifications([]);
      setUnreadCount(0);
      return;
    }

    getUnreadCount();
    if (isNotificationPage) getAll(false);

    const intervalId = setInterval(() => {
      getUnreadCount();
      if (isNotificationPage) getAll(false);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [authenticatedUser, isNotificationPage, getAll, getUnreadCount]);

  const handleNotificationClick = (notification: NotificationDto) => {
    // Routing Logic
    if (notification.type && notification.idReference) {
      const paths: Record<string, string> = {
        TEAM: `/teams/${notification.idReference}`,
        MATCH: `/matches/${notification.idReference}`,
        TOURNAMENT: `/tournaments/${notification.idReference}`,
      };

      const targetPath = paths[notification.type];
      if (targetPath) navigate(targetPath);
    }
  };
  return (
    <NotificationContext.Provider
      value={{
        allNotifications,
        unreadNotifications,
        unreadCount,
        markAsRead,
        getAll,
        getUnreadCount,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
