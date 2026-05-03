import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { MainContext } from './types';
import { Box } from '@mui/material';
import { NotificationProvider } from './contexts/NotificationContext';
import { TournamentModalProvider } from './contexts/TournamentModalContext';
import { TournamentModal } from './modals/TournamentModal';
import { TournamentsPageContextProvider } from './pages/TournamentsPage/contexts/TournamentsPageContext';

export const App = () => {
  const mainContext: MainContext = {};

  return (
    <NotificationProvider>
      <TournamentModalProvider>
        <TournamentsPageContextProvider>
          <Header />
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflowY: 'auto',
            }}
          >
            <Outlet context={mainContext} />
          </Box>

          <TournamentModal />
        </TournamentsPageContextProvider>
      </TournamentModalProvider>
    </NotificationProvider>
  );
};
