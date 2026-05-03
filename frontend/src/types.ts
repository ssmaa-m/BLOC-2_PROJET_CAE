import { ReactNode } from 'react';
import { TournamentFilters, YearGroup } from './utils/tournamentUtils';

interface MainContext {}

interface UserContextType {
  authenticatedUser: MaybeAuthenticatedUser;
  setAuthenticatedUser: (user: MaybeAuthenticatedUser) => void;
  register: (
    newUser: User,
    navigate: (path: string) => void,
  ) => Promise<void | null>;
  login: (user: User, navigate: (path: string) => void) => Promise<void | null>;
  clearUser: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
}
interface ProfilePicture {
  idImage: number;
  path: string;
}

interface User {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface Member {
  deleted: boolean;
  id: number;
  tag: string;
  email: string;
  admin: boolean;
  specialty: Specialty;
  profileImage: ProfilePicture;
}

interface Specialty {
  idSpecialty: number;
  label: string;
}

interface Unavailability {
  id: number;
  startDate: string;
  endDate: string;
}

interface ProfileInfoDto {
  id: number;
  email: string | null;
  tag: string;
  specialty: string | null;
  creationDate: string | null;
  avatar: string | null;
  admin: boolean | null;
  isSelf: boolean; // Indicates if this profile belongs to the currently logged in user
  team: {
    id: number;
    name: string;
    manager: boolean; // Calculated based on if Member is manager1 or manager2 in Team
    membersCount: number;
    hasOtherManager: boolean;
  } | null; // User might not have a team yet
  unavailabilities:
    | {
        id: number;
        startDate: string;
        endDate: string;
      }[]
    | null;
}

interface AuthenticatedUser {
  id: number;
  admin: boolean;
  tag: string;
  managedTeamId?: number;
  token: string;
  teamId?: number;
}

interface UserSummaryDto {
  id: number;
  tag: string;
  avatar: string | null;
}

interface MemberSummaryDto {
  id: number;
  tag: string;
  avatar: string | null;
  specialty: string | null;
}

interface Team {
  idTeam: number;
  name: string;
  isActive: boolean;
}

interface FullTeamDto extends Team {
  members: MemberSummaryDto[];
  managerId1: number;
  managerId2: number;
}

interface JoinRequestDto {
  idJoinRequest: number;
  idTeam: number;
  teamName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  expirationDate: string;
  requester: UserSummaryDto;
  rejectionReason?: string;
}

interface TeamDetailsInfoDto {
  idTeam: number;
  name: string;
  isActive: boolean;
  managers: UserSummaryDto[];
  members: UserSummaryDto[];
  joinRequests: JoinRequestDto[] | null;
}

export type NotificationType = 'TEAM' | 'MATCH' | 'TOURNAMENT';
interface NotificationDto {
  idNotification: number;
  content: string;
  isRead: boolean;
  dateTime: Date;
  type: NotificationType;
  idReference: number | null;
}

interface StoredUser {
  token: string;
}

interface SpecialtyDto {
  id: number;
  label: string;
}

type MaybeAuthenticatedUser = AuthenticatedUser | undefined | null;

interface ModalConfig {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  confirmDisabled?: boolean;
  loading?: boolean;
  onConfirm?: (close: () => void) => void;
  onCancel?: (close: () => void) => void;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  tag: string;
  specialtyId: number | null;
  profileImageId: number | null;
}
interface TournamentDto {
  idTournament: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: TournamentStatus;
  capacity: number;
  registrationsCount: number;
}

type TournamentStatus =
  | 'IN_PREPARATION'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELLED';

interface MatchTeamDto {
  idTeam: number;
  name: string;
  score: number | null;
  isWinner: boolean;
  hasForfeited: boolean;
  lineup?: MatchLineupDto;
  confirmationStatus: ConfirmationStatus;
}

export type ConfirmationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CONTESTED'
  | 'ADMIN_LOCKED';

interface MatchLineupDto {
  matchId: number;
  teamId: number;
  teamName: string;
  players: MemberSummaryDto[];
}

interface MatchSummaryDto {
  idMatch: number;
  dateHour: string;
  turn: number;
  status: matchStatus;
  teams: Team[];
  team1: MatchTeamDto;
  team2: MatchTeamDto;
  tournament: MatchSummaryDtoTournament;
  isFinal: boolean;
}

export type matchStatus =
  | 'PLANNED'
  | 'PLAYED'
  | 'IN_PROGRESS'
  | 'AWAITING_VALIDATION'
  | 'FORFEIT';

interface MatchSummaryDtoTournament {
  id: number;
  name: string;
  status: TournamentStatus;
}

interface TournamentDetailsInfoDto {
  idTournament: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  capacity: number;
  registrationsCount: number;
  teams: TeamSummaryDto[];
  matches: MatchSummaryDto[];
  registrationDeadline: string;
}

interface TournamentFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  capacity: number;
}

interface TeamSummaryDto {
  idTeam: number;
  name: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export type MemberQueryStatus = 'ADMIN' | 'MEMBER' | 'BANNED';

interface MemberFilters {
  status?: MemberQueryStatus;
  searchQuery?: string;
}

interface TournamentsPageContextType {
  filters: TournamentFilters;
  fetchWithFilters: () => void;
  setFilters: (filters: TournamentFilters) => void;
  authenticatedUser: AuthenticatedUser | null;
  isGettingTournaments: boolean;
  tournaments: TournamentDto[];
  groupedTournaments: YearGroup[];
}

interface TournamentMatchFilters {
  data: 'tournaments' | 'matches';
  searchQuery: string;
}

interface ConfirmOrContestMatchParams {
  id: number;
  isTeam1: boolean;
  isConfirming: boolean;
  previousMatch: MatchSummaryDto;
}

interface EncodeMatchResultDto {
  scoreTeam1: number;
  scoreTeam2: number;
}

interface DeclareForfeitMatchParams {
  matchId: number;
  winningTeamId: number;
  forfeitingTeamId: number;
}

export type {
  MainContext,
  User,
  AuthenticatedUser,
  MaybeAuthenticatedUser,
  UserContextType,
  ProfileInfoDto,
  Team,
  FullTeamDto,
  Unavailability,
  JoinRequestDto,
  TeamDetailsInfoDto,
  NotificationDto,
  StoredUser,
  Member,
  MemberSummaryDto,
  SpecialtyDto,
  ProfilePicture,
  ModalConfig,
  RegisterFormData,
  UserSummaryDto,
  TournamentDto,
  MatchTeamDto,
  MatchSummaryDto,
  TournamentDetailsInfoDto,
  TeamSummaryDto,
  TournamentStatus,
  TournamentFormData,
  MemberFilters,
  TournamentsPageContextType,
  TournamentMatchFilters,
  MatchLineupDto,
  ConfirmOrContestMatchParams,
  EncodeMatchResultDto,
  DeclareForfeitMatchParams,
};
