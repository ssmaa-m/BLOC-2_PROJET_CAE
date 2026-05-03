import { Button, Menu, MenuItem } from '@mui/material';
import { useMenuDisclosure } from '../../../../../hooks/useMenuDisclosure';
import { ChevronDown } from '@gravity-ui/icons';
import { MemberFilters, MemberQueryStatus } from '../../../../../types';

interface AdminFilterMenuProps {
  filters: MemberFilters;
  setFilters: (filter: MemberFilters) => void;
  getFilterOptions: () => (MemberQueryStatus | undefined)[];
  handleFilterSelect: (filter: MemberQueryStatus | undefined) => void;
  getMemberStatusLabel: (status: MemberQueryStatus | undefined) => string;
}

export const AdminFilterMenu = ({
  filters,
  getFilterOptions,
  handleFilterSelect,
  getMemberStatusLabel,
}: AdminFilterMenuProps) => {
  const { anchorEl, handleClick, handleClose } = useMenuDisclosure();
  return (
    <>
      <Button
        sx={{
          flexShrink: 0,
          maxWidth: 'none',
          marginRight: '0 !important',
          width: 'fit-content !important',
          background: (theme) => theme.palette.background.s4,
          color: (theme) => `${theme.palette.text.primary} !important`,
        }}
        variant="contained"
        color="secondary"
        endIcon={
          <ChevronDown
            style={{
              rotate: anchorEl ? '180deg' : '0deg',
              transition: 'rotate 0.2s cubic-bezier(0.2, 0, 0, 1)',
            }}
          />
        }
        onClick={handleClick}
      >
        {filters.status === undefined
          ? 'Tous'
          : filters.status === 'MEMBER'
            ? 'Membres'
            : filters.status === 'BANNED'
              ? 'Bannis'
              : 'Admins'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            width: 'fit-content',
          },
        }}
        onClose={handleClose}
      >
        {getFilterOptions().map((status) => (
          <MenuItem
            key={status || 'ALL'}
            onClick={() => {
              handleFilterSelect(status);
              handleClose();
            }}
          >
            {getMemberStatusLabel(status)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
