import { MatchTeamDto } from '../types';

export const isConfirmed = (team: MatchTeamDto | null | undefined) => {
  return (
    team?.confirmationStatus === 'CONFIRMED' ||
    team?.confirmationStatus === 'ADMIN_LOCKED'
  );
};

export const isContested = (team: MatchTeamDto | null | undefined) => {
  return team?.confirmationStatus === 'CONTESTED';
};

export const isAdminLocked = (team: MatchTeamDto | null | undefined) => {
  return team?.confirmationStatus === 'ADMIN_LOCKED';
};

export const isPending = (team: MatchTeamDto | null | undefined) => {
  return team?.confirmationStatus === 'PENDING';
};
