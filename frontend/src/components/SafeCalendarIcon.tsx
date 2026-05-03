import { Calendar } from '@gravity-ui/icons';
import { SvgIconProps } from '@mui/material';

interface SafeCalendarIconProps extends SvgIconProps {
  ownerState?: unknown;
}

export const SafeCalendarIcon = ({
  ownerState,
  ...restProps
}: SafeCalendarIconProps) => {
  void ownerState;
  return <Calendar {...restProps} />;
};
