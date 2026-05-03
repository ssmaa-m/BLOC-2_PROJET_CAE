import { MenuItem, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface MatchMenuItemProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
}

export const MatchMenuItem = ({
  onClick,
  icon,
  label,
  disabled,
}: MatchMenuItemProps) => {
  return (
    <MenuItem onClick={onClick} disabled={disabled}>
      {icon}
      <Typography variant="h5">{label}</Typography>
    </MenuItem>
  );
};
