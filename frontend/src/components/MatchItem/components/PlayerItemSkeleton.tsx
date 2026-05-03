import { Skeleton, Stack, Typography } from '@mui/material';

export const PlayerItemSkeleton = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="1rem"
      height="4.25rem"
      sx={{
        borderRadius: '0.75rem',
        px: '0.875rem',
      }}
    >
      <Skeleton variant="circular" width="2.5rem" height="2.5rem" />

      <Stack flex={1}>
        <Typography variant="h5" sx={{ userSelect: 'none' }}>
          <Skeleton variant="text" width="8rem" />
        </Typography>
        <Typography variant="body1" sx={{ userSelect: 'none' }}>
          <Skeleton variant="text" width="10rem" />
        </Typography>
      </Stack>
      <Skeleton
        variant="rectangular"
        width="1.5rem"
        height="1.5rem"
        sx={{ borderRadius: '0.25rem' }}
      />
    </Stack>
  );
};
