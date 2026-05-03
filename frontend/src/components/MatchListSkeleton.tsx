import { Skeleton, Stack, Typography } from '@mui/material';

const MatchItemSkeleton = () => {
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
        height="3.5rem"
        gap="1rem"
        px="0.75rem"
      >
        <Stack flex={1} alignItems="flex-end">
          <Skeleton variant="text" width="5rem" />
        </Stack>
        <Typography variant="h5">
          <Skeleton variant="text" width="1.5rem" />
        </Typography>
        <Stack flex={1}>
          <Skeleton variant="text" width="5rem" />
        </Stack>
      </Stack>
      <Stack
        width="100%"
        bgcolor="background.s3"
        height="2rem"
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        px="0.75rem"
      >
        <Skeleton variant="text" width="3rem" />
        <Skeleton
          variant="rectangular"
          width="4rem"
          height="1.25rem"
          sx={{ borderRadius: '100rem' }}
        />
      </Stack>
    </Stack>
  );
};

const MatchDayGroupSkeleton = ({ itemsCount }: { itemsCount: number }) => {
  return (
    <Stack
      padding="1.5rem 1rem 1rem"
      spacing="0.75rem"
      bgcolor="background.s1"
      borderRadius="1.5rem"
    >
      <Typography variant="h4" pb="1rem" width="12rem">
        <Skeleton variant="text" />
      </Typography>
      {Array.from({ length: itemsCount }).map((_, i) => (
        <MatchItemSkeleton key={i} />
      ))}
    </Stack>
  );
};

const MatchYearGroupSkeleton = ({ layout }: { layout: number[] }) => {
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
        <MatchDayGroupSkeleton key={i} itemsCount={itemsCount} />
      ))}
    </Stack>
  );
};

export const MatchListSkeleton = () => {
  return (
    <>
      <MatchYearGroupSkeleton layout={[3, 2, 4]} />
      <MatchYearGroupSkeleton layout={[2, 3]} />
    </>
  );
};
