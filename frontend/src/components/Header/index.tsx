import { Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import logo from '../../assets/images/logo.svg';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { NotificationMenu } from './components/NotificationMenu';
import { UserContext } from '../../contexts/UserContext';
import { UserMenu } from './components/UserMenu';
import { AdminManagementModal } from './modals/AdminManagementModal';
import { useState } from 'react';
import { useTournamentModal } from '../../hooks/useTournamentModal';

export const Header = () => {
  const location = useLocation();
  const { authenticatedUser } = useContext(UserContext);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { openCreateModal } = useTournamentModal();

  return (
    <>
      <Stack
        component="header"
        direction="row"
        height="5rem"
        padding="0 2.25rem"
        alignItems="center"
        sx={{
          background: (theme) => theme.palette.background.s1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', height: '100%' }}>
          <Stack
            direction="row"
            spacing="0.75rem"
            alignItems="center"
            paddingRight="2.5rem"
            height="100%"
          >
            <img src={logo} alt="logo" width={24} height={24} />
            <Typography variant="h4">Vinci Arena</Typography>
          </Stack>
        </Link>
        <Tabs
          value={
            location.pathname.startsWith('/teams')
              ? '/teams'
              : location.pathname.startsWith('/tournaments')
                ? '/tournaments'
                : false
          }
          sx={{ flex: 1 }}
        >
          <Tab
            label="Tournois"
            value="/tournaments"
            component={Link}
            to="/tournaments"
            data-testid="nav-tournaments-tab"
          />
          <Tab
            label="Teams"
            value="/teams"
            component={Link}
            to="/teams"
            data-testid="nav-teams-tab"
          />
        </Tabs>
        <Stack direction="row" spacing="1.5rem">
          <Stack direction="row" spacing="1rem">
            {authenticatedUser?.admin && (
              <Stack direction="row" spacing="1rem">
                <Button
                  variant="contained"
                  onClick={() => openCreateModal()}
                  data-testid="admin-create-tournament-button"
                >
                  Créer un Tournoi
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsAdminModalOpen(true)}
                  data-testid="admin-manage-members-button"
                >
                  Gérer les Membres
                </Button>
              </Stack>
            )}
            {authenticatedUser ? (
              <>
                <NotificationMenu />
                <UserMenu />
              </>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button
                    variant="contained"
                    color="secondary"
                    data-testid="header-register-button"
                  >
                    S'Inscrire
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="contained" data-testid="header-login-button">
                    Se Connecter
                  </Button>
                </Link>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      <AdminManagementModal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};
