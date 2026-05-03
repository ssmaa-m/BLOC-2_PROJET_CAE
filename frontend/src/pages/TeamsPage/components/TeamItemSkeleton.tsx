import { Skeleton, Stack, Typography } from '@mui/material';

export const TeamItemSkeleton = () => {
  return (
    <Stack
      borderRadius="0.75rem"
      sx={{
        background: (theme) => theme.palette.background.s1,
        textDecoration: 'none',
      }}
      overflow="hidden"
      border="1px solid"
      borderColor="divider"
    >
      <Stack
        py="0.75rem"
        alignItems="center"
        sx={{ background: (theme) => theme.palette.background.s2 }}
      >
        <Typography variant="h5">
          <Skeleton variant="text" width="6rem" />
        </Typography>
      </Stack>
      <Stack
        padding="0.25rem 0.25rem 0.25rem 0.625rem"
        alignItems="center"
        direction="row"
      >
        <Typography
          variant="h6"
          color="secondary"
          flex="1"
          lineHeight="1.375rem"
        >
          <Skeleton variant="text" width="5rem" />
        </Typography>
        <Skeleton
          variant="rounded"
          sx={{ borderRadius: '100rem' }}
          height="1.375rem"
          width="5rem"
        />
      </Stack>
    </Stack>
  );
};
