import { Stack, Typography } from '@mui/material';
import { MatchSummaryDto } from '../../../types';
import { useUser } from '../../../hooks/useUser';
import { getOverlayDisplay } from '../utils/displayRules';

interface MatchOverlayProps {
  children: React.ReactNode;
  match: MatchSummaryDto;
}

const linkStyle = {
  sx: { '& a': { textDecoration: 'none !important', fontWeight: '700' } },
};

export const MatchOverlay = ({ children, match }: MatchOverlayProps) => {
  const { authenticatedUser } = useUser();

  const { displayOverlay, getOverlayLabel } = getOverlayDisplay({
    match,
    authenticatedUser,
  });

  if (!displayOverlay) return children;
  return (
    <Stack bgcolor="primary.main" borderRadius="0.76rem">
      {children}
      <Stack
        padding="0 1.5rem"
        height="1.75rem"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h5" color="primary.contrastText" {...linkStyle}>
          {getOverlayLabel()}
        </Typography>
      </Stack>
    </Stack>
  );
};
