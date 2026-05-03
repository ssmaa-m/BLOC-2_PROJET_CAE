import { useTheme } from '@mui/material';
import { useMenuDisclosure } from '../../../hooks/useMenuDisclosure';
import { useUser } from '../../../hooks/useUser';
import { MatchSummaryDto } from '../../../types';
import { getMenuSectionDisplay } from '../utils/displayRules';
import { useMatchMenuAction } from './useMatchMenuAction';

interface MatchMenuProps {
  match: MatchSummaryDto;
  refetch: () => void;
}

export const useMatchMenu = ({ match, refetch }: MatchMenuProps) => {
  const theme = useTheme();
  const { anchorEl, handleClick, handleClose } = useMenuDisclosure();
  const { authenticatedUser } = useUser();
  const {
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
  } = getMenuSectionDisplay({ match, authenticatedUser });
  const {
    handleForfeit,
    handleEditComposition,
    handleConfirmOrContestScore,
    handleEncodeScore,
    handleEditScore,
  } = useMatchMenuAction({ match, refetch });

  return {
    theme,
    anchorEl,
    handleClick,
    handleClose,
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
    handleForfeit,
    handleEditComposition,
    handleConfirmOrContestScore,
    handleEncodeScore,
    handleEditScore,
    authenticatedUser,
  };
};
