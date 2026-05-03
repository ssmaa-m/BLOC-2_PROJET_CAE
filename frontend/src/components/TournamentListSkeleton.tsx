import { Skeleton, Stack, Typography } from '@mui/material';

export const TournamentItemSkeleton = () => {
  return (
    <Stack
      bgcolor="background.s2"
      borderRadius="0.75rem"
      overflow="hidden"
      border="1px solid"
      borderColor="divider"
      sx={{ '&:hover': { cursor: 'default' } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        height="4rem"
        gap="1rem"
      >
        <Stack direction="row" flex={1} pl="0.75rem" />
        <Typography variant="h3" width="30%">
          <Skeleton variant="text" />
        </Typography>
        <Stack direction="row" flex={1} justifyContent="flex-end" pr="0.75rem">
          <Skeleton
            variant="rounded"
            width="4rem"
            height="2rem"
            sx={{ borderRadius: '0.5rem' }}
          />
        </Stack>
      </Stack>
      <Stack
        width="100%"
        bgcolor="background.s3"
        height="2.5rem"
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        px="0.75rem"
      >
        <Typography variant="h5" flex={1}>
          <Skeleton variant="text" width="60%" />
        </Typography>
        <Typography
          variant="body2"
          display="flex"
          justifyContent="center"
          width="30%"
        >
          <Skeleton variant="text" width="100%" />
        </Typography>
        <Stack alignItems="flex-end" flex={1}>
          <Skeleton
            variant="rectangular"
            width="4.5rem"
            height="1.5rem"
            sx={{ borderRadius: '100rem' }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

const TournamentMonthGroupSkeleton = ({
  itemsCount,
}: {
  itemsCount: number;
}) => {
  return (
    <Stack
      padding="1.5rem 1rem 1rem"
      spacing="0.75rem"
      bgcolor="background.s1"
      borderRadius="1.5rem"
    >
      <Typography variant="h4" pb="1rem" width="8rem">
        <Skeleton variant="text" />
      </Typography>
      {Array.from({ length: itemsCount }).map((_, i) => (
        <TournamentItemSkeleton key={i} />
      ))}
    </Stack>
  );
};

const TournamentYearGroupSkeleton = ({ layout }: { layout: number[] }) => {
  return (
    <Stack spacing="1rem">
      <Stack
        position="sticky"
        top="6.5rem"
        zIndex={1}
        bgcolor="background.s0"
        width="fit-content"
        borderRadius="0.75rem"
        padding="0.5rem 1rem"
        ml="0.75rem !important"
      >
        <Typography variant="h2" width="4rem">
          <Skeleton variant="text" />
        </Typography>
      </Stack>
      {layout.map((itemsCount, i) => (
        <TournamentMonthGroupSkeleton key={i} itemsCount={itemsCount} />
      ))}
    </Stack>
  );
};

export const TournamentListSkeleton = () => {
  return (
    <>
      <TournamentYearGroupSkeleton layout={[2, 1]} />
      <TournamentYearGroupSkeleton layout={[2]} />
    </>
  );
};
