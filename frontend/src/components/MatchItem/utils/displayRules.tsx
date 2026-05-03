import { Box, BoxProps, TypographyProps } from '@mui/material';
import {
  MatchSummaryDto,
  MatchTeamDto,
  MaybeAuthenticatedUser,
} from '../../../types';
import { isContested, isPending } from '../../../utils/confirmationUtils';
import { Flag } from '@gravity-ui/icons';

interface UseMenuSectionDisplayProps {
  match: MatchSummaryDto;
  authenticatedUser: MaybeAuthenticatedUser;
}

export const getMenuSectionDisplay = ({
  match,
  authenticatedUser,
}: UseMenuSectionDisplayProps) => {
  const isAdmin = authenticatedUser?.admin ?? false;
  const managedTeamId = authenticatedUser?.managedTeamId;

  const team1 = match.team1;
  const team2 = match.team2;

  const managedTeam: MatchTeamDto | null =
    team1?.idTeam === managedTeamId
      ? team1
      : team2?.idTeam === managedTeamId
        ? team2
        : null;

  const isManagerOfParticipant = !!managedTeam;

  const isPlayed = match.status === 'PLAYED';

  if (isPlayed)
    return {
      showTeamSection: false,
      showForfeit: false,
      showEditComposition: false,
      showScoresSection: false,
      showAdminEncode: false,
      showAdminModify: false,
      showAdminSection: false,
      needsDividerAfterTeam: false,
      needsDividerAfterScores: false,
      displayMenu: false,
    };

  const managedTeamScoresHaveBeenConfirmedOrContested =
    managedTeam && !isPending(managedTeam);

  const isPlanned = match.status === 'PLANNED';
  const isInProgress = match.status === 'IN_PROGRESS';
  const isForfeit = match.status === 'FORFEIT';
  const isInAwaitingValidation = match.status === 'AWAITING_VALIDATION';

  const bothTeamsKnown = team1 && team2;

  const showForfeit =
    isPlanned && !isForfeit && isManagerOfParticipant && bothTeamsKnown;

  const showEditComposition = isManagerOfParticipant && isPlanned;
  const showTeamSection = showForfeit || showEditComposition;

  const hasContestedScore =
    (team1 && isContested(team1)) || (team2 && isContested(team2));

  const showScoresSection =
    isManagerOfParticipant &&
    isInAwaitingValidation &&
    !managedTeamScoresHaveBeenConfirmedOrContested;

  const showAdminEncode = isAdmin && isInProgress;

  const showAdminModify =
    isAdmin && isInAwaitingValidation && hasContestedScore;
  const showAdminSection = showAdminEncode || showAdminModify;

  const visibleSections = [
    showTeamSection,
    showScoresSection,
    showAdminSection,
  ].filter(Boolean);

  const needsDividerAfterTeam = showTeamSection && visibleSections.length > 1;
  const needsDividerAfterScores = showScoresSection && showAdminSection;

  const hasAnySection =
    showTeamSection || showScoresSection || showAdminSection;

  const isTournamentActive =
    match.tournament.status === 'PLANNED' ||
    match.tournament.status === 'IN_PROGRESS';

  const displayMenu = hasAnySection && isTournamentActive;

  return {
    showTeamSection,
    showForfeit,
    showEditComposition,
    showScoresSection,
    showAdminEncode,
    showAdminModify,
    showAdminSection,
    needsDividerAfterTeam,
    needsDividerAfterScores,
    displayMenu,
  };
};

export const getOverlayDisplay = ({
  match,
  authenticatedUser,
}: {
  match: MatchSummaryDto;
  authenticatedUser: MaybeAuthenticatedUser;
}) => {
  if (match.tournament.status === 'REGISTRATION_CLOSED')
    return {
      displayOverlay: false,
      getOverlayLabel: () => '',
    };
  const isAdmin = authenticatedUser?.admin;

  const isPlanned = match.status === 'PLANNED';

  const isInProgress = match.status === 'IN_PROGRESS';

  const isInAwaitingValidation = match.status === 'AWAITING_VALIDATION';

  const team =
    match.team1?.idTeam === authenticatedUser?.managedTeamId
      ? match.team1
      : match.team2?.idTeam === authenticatedUser?.managedTeamId
        ? match.team2
        : null;

  const canConfirmScores = team && isPending(team) && isInAwaitingValidation;

  const isCompositionFull = (team?.lineup?.players.length ?? 0) < 4;

  const canEditComposition = team && isPlanned && isCompositionFull;

  const canEncodeScores = isAdmin && isInProgress;

  const team1 = match.team1;
  const team2 = match.team2;

  const hasContestedScore = isContested(team1) || isContested(team2);
  const canEditScores = isAdmin && isInAwaitingValidation && hasContestedScore;
  const displayOverlay =
    canConfirmScores ||
    canEditComposition ||
    canEncodeScores ||
    canEditScores ||
    hasContestedScore;

  const getOverlayLabel = () => {
    if (canEncodeScores) return 'Veuillez encoder les scores de ce match.';
    if (canEditScores) return 'Veuillez corriger les scores de ce match.';
    if (canConfirmScores)
      return 'Veuillez confirmer ou contester les scores de ce match.';
    if (hasContestedScore)
      return 'Le résultat de ce match est actuellement contesté.';
    if (canEditComposition)
      return 'Veuillez enregistrer des joueurs pour ce match.';
  };

  return {
    displayOverlay,
    getOverlayLabel,
  };
};

export const getTypographyProps = ({
  matchTeam,
  isFinal,
}: {
  matchTeam: MatchTeamDto;
  isFinal: boolean;
}): TypographyProps => {
  const isWinner = matchTeam?.isWinner && isFinal;
  return {
    variant: 'h4',
    borderRadius: isWinner ? '100rem' : '0.25rem',
    padding: isWinner ? '0.125rem 0.75rem' : '',
    sx: {
      opacity: matchTeam?.name ? 1 : 0.5,
      textDecoration: 'none',
      color: (theme) =>
        isWinner
          ? `${theme.palette.primary.main} !important`
          : `${theme.palette.text.primary} !important`,
      background: (theme) =>
        isWinner
          ? `color-mix(in srgb, ${theme.palette.primary.main} 10%, ${theme.palette.background.s3})`
          : `none`,
    },
    textOverflow: 'ellipsis',
    noWrap: true,
  };
};

const boxProps: BoxProps = {
  display: 'contents',
  sx: {
    color: (theme) => theme.palette.text.secondary,
  },
};

export const getVersusItemDisplay = ({
  match,
  authenticatedUser,
}: {
  match: MatchSummaryDto;
  authenticatedUser: MaybeAuthenticatedUser;
}) => {
  const isAdmin = !!authenticatedUser?.admin;

  const isAwaitingValidation = match.status === 'AWAITING_VALIDATION';
  const isPlayed = match.status === 'PLAYED';
  const isForfeit = match.status === 'FORFEIT';

  const showScoresSection = isPlayed || isAwaitingValidation || isForfeit;

  const isManager =
    authenticatedUser?.managedTeamId === match.team1?.idTeam ||
    authenticatedUser?.managedTeamId === match.team2?.idTeam;

  const revealScores = isPlayed || isForfeit || isManager || isAdmin;

  const isFinal = match.isFinal;

  const getScore = ({ team }: { team: MatchTeamDto | undefined }) => {
    const hasForfeited = team?.hasForfeited;

    const score = team?.score;

    if (hasForfeited)
      return (
        <Box {...boxProps}>
          <Flag />
        </Box>
      );
    else if (revealScores) return score;
    else return '-';
  };

  return {
    showScoresSection,
    revealScores,
    isFinal,
    isForfeit,
    getScore,
  };
};
