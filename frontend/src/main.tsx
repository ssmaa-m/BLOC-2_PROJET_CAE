import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { App } from './App.tsx';
import { TournamentsPage } from './pages/TournamentsPage';
import { RegisterPage } from './pages/RegisterPage/index.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { UserContextProvider } from './contexts/UserContext.tsx';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './themes.tsx';
import { ProfilePage } from './pages/ProfilePage/index.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { TeamPage } from './pages/TeamPage/index.tsx';
import { ModalContextProvider } from './contexts/ModalContext.tsx';
import { SnackbarProvider } from './contexts/SnackbarContext.tsx';
import { TournamentPage } from './pages/TournamentPage/index.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { TeamsPage } from './pages/TeamsPage/index.tsx';
import { HomePage } from './pages/HomePage/index.tsx';

dayjs.locale('fr');

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'teams',
        children: [
          {
            path: '',
            element: <TeamsPage />,
          },
          {
            path: ':id',
            element: <TeamPage />,
          },
        ],
      },
      {
        path: 'users/:id',
        element: <ProfilePage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'tournaments',
        children: [
          {
            path: '',
            element: <TournamentsPage />,
          },
          { path: ':id', element: <TournamentPage /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    children: [
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <UserContextProvider>
            <ModalContextProvider>
              <RouterProvider router={router} />
            </ModalContextProvider>
          </UserContextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>,
);
