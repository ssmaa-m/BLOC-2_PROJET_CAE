import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { TournamentDetailsInfoDto } from '../types';

interface TournamentModalContextType {
  isOpen: boolean;
  tournamentToEdit: TournamentDetailsInfoDto | null;
  onSuccess: ((tournament: TournamentDetailsInfoDto) => void) | null;
  openCreateModal: (
    onSuccess?: (tournament: TournamentDetailsInfoDto) => void,
  ) => void;
  openEditModal: (
    tournament: TournamentDetailsInfoDto,
    onSuccess?: (tournament: TournamentDetailsInfoDto) => void,
  ) => void;
  closeModal: () => void;
}

const TournamentModalContext = createContext<TournamentModalContextType | null>(
  null,
);

const TournamentModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tournamentToEdit, setTournamentToEdit] =
    useState<TournamentDetailsInfoDto | null>(null);
  const [onSuccess, setOnSuccess] = useState<
    ((tournament: TournamentDetailsInfoDto) => void) | null
  >(null);

  const openCreateModal = useCallback(
    (onSuccessCallback?: (tournament: TournamentDetailsInfoDto) => void) => {
      setTournamentToEdit(null);
      setOnSuccess(() => onSuccessCallback ?? null);
      setIsOpen(true);
    },
    [],
  );

  const openEditModal = useCallback(
    (
      tournament: TournamentDetailsInfoDto,
      onSuccessCallback?: (tournament: TournamentDetailsInfoDto) => void,
    ) => {
      setTournamentToEdit(tournament);
      setOnSuccess(() => onSuccessCallback ?? null);
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      tournamentToEdit,
      onSuccess,
      openCreateModal,
      openEditModal,
      closeModal,
    }),
    [
      isOpen,
      tournamentToEdit,
      onSuccess,
      openCreateModal,
      openEditModal,
      closeModal,
    ],
  );

  return (
    <TournamentModalContext.Provider value={value}>
      {children}
    </TournamentModalContext.Provider>
  );
};

export { TournamentModalContext, TournamentModalProvider };
