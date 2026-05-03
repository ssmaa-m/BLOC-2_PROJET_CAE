import { Box, Stack } from '@mui/material';

interface VersusSymbolProps {
  absolute?: boolean;
}

export const VersusSymbol = ({ absolute = true }: VersusSymbolProps) => (
  <Stack
    width="0.375rem"
    position={absolute ? 'absolute' : 'relative'}
    top={absolute ? '50%' : ''}
    left={absolute ? '50%' : ''}
    sx={{ transform: absolute ? 'translate(-50%, -50%)' : '' }}
    alignItems="center"
  >
    <Box
      width="1px"
      height="1.25rem"
      sx={{ rotate: '30deg', background: (theme) => theme.palette.divider }}
    />
  </Stack>
);
