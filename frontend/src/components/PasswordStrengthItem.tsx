import { Box, Stack, Typography } from '@mui/material';
import { Check } from '@gravity-ui/icons';

interface PasswordStrengthItemProps {
  text: string;
  isValid: boolean;
  crossText?: boolean;
}

export const PasswordStrengthItem = ({
  text,
  isValid,
  crossText = true,
}: PasswordStrengthItemProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="0.25rem"
      padding="0 0.5rem"
      height="1.375rem"
    >
      <Stack
        width="1rem"
        height="1rem"
        borderRadius="0.25rem"
        alignItems="center"
        justifyContent="center"
        color={isValid ? 'success.main' : 'text.secondary'}
        sx={{
          background: (theme) =>
            isValid
              ? `color-mix(in srgb, ${theme.palette.success.main} 10%, transparent)`
              : 'none',
        }}
      >
        {isValid ? (
          <Check style={{ fontSize: '0.875rem' }} />
        ) : (
          <Box
            sx={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '100rem',
              backgroundColor: 'divider',
            }}
          />
        )}
      </Stack>
      <Typography
        variant="body1"
        fontSize="0.75rem"
        lineHeight="1rem"
        color="text.secondary"
        sx={{ textDecoration: isValid && crossText ? 'line-through' : 'none' }}
      >
        {text}
      </Typography>
    </Stack>
  );
};
