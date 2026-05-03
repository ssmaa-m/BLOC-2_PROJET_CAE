import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { MaybeAuthenticatedUser, User, UserContextType } from '../types';
import { useApi } from '../hooks/useApi';

import {
  clearAuthenticatedUser,
  getAuthenticatedUser,
  storeAuthenticatedUser,
} from '../utils/session';
import { useSnackbar } from '../hooks/useSnackbar';

const defaultUserContext: UserContextType = {
  authenticatedUser: undefined,
  register: async () => {},
  login: async () => {},
  clearUser: () => {},
  isLoggingIn: false,
  isRegistering: false,
  setAuthenticatedUser: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const { showSnackbar } = useSnackbar();
  const [authenticatedUser, setAuthenticatedUser] =
    useState<MaybeAuthenticatedUser>(undefined);

  const clearUser = useCallback(() => {
    clearAuthenticatedUser();
    setAuthenticatedUser(null);
  }, []);

  const { execute: relog } = useApi(
    async (token: string) => {
      const response = await fetch('/api/auths/login/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      return response.json();
    },
    {
      onSuccess: (data) => {
        setAuthenticatedUser({ ...data });
      },
      onError: () => {
        clearUser();
      },
    },
  );

  useEffect(() => {
    const storedUser = getAuthenticatedUser();
    if (!storedUser) {
      setAuthenticatedUser(null);
      return;
    }

    relog(storedUser.token);
  }, [relog]);

  const { execute: register, loading: isRegistering } = useApi(
    async (newUser: User, navigate: (path: string) => void) => {
      void navigate;
      const response = await fetch('/api/auths/register', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }
    },
    {
      onSuccess: (_, __, navigate) => {
        navigate('/auth/login');
        showSnackbar({
          message: 'Compte créé avec succès !',
          severity: 'success',
        });
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la création du compte !',
          severity: 'error',
        });
      },
    },
  );

  const { execute: login, loading: isLoggingIn } = useApi(
    async (
      { email, password, rememberMe }: User,
      navigate: (path: string) => void,
    ) => {
      void navigate, rememberMe;
      const response = await fetch('/api/auths/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Identifiants invalides');
      }
      return response.json();
    },
    {
      onSuccess: (data, { rememberMe }, navigate) => {
        storeAuthenticatedUser(data, rememberMe ?? false);
        setAuthenticatedUser(data);
        navigate('/');
      },
      onError: (err) => {
        showSnackbar({
          message:
            err instanceof Error
              ? err.message
              : 'Une erreur est survenue lors de la connexion !',
          severity: 'error',
        });
      },
    },
  );

  /**
   * make sure that the userContextValue is memoized
   * to prevent unnecessary re-renders of components that use it
   */
  const myContext: UserContextType = useMemo(
    () => ({
      authenticatedUser,
      setAuthenticatedUser,
      register,
      login,
      clearUser,
      isLoggingIn,
      isRegistering,
    }),
    [
      authenticatedUser,
      setAuthenticatedUser,
      register,
      login,
      clearUser,
      isLoggingIn,
      isRegistering,
    ],
  );

  return (
    <UserContext.Provider value={myContext}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
