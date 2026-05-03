import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { UserItem } from './components/UserItem';
import { useUser } from '../../../../hooks/useUser';
import { AdminFilterMenu } from './components/AdminFilterMenu';
import { ModalScrollSx } from '../../../../themes';
import { useAdminManagementModal } from './hooks/useAdminManagementModal';

interface AdminManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminManagementModal = ({
  open,
  onClose,
}: AdminManagementModalProps) => {
  const { authenticatedUser } = useUser();
  const {
    debouncedSearch,
    setDebouncedSearch,
    filters,
    setFilters,
    getFilterOptions,
    handleFilterSelect,
    getMemberStatusLabel,
    canScrollTop,
    canScrollBottom,
    handleScroll,
    scrollRef,
    contentHeight,
    contentRef,
    isGettingUsers,
    handleBan,
    handleToggleAdmin,
    pendingIds,
    users,
  } = useAdminManagementModal({ open });
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle variant="h2">Gérer les Membres</DialogTitle>
      <Typography textAlign="center" color="secondary" padding="0 2rem 1rem">
        Recherchez et gérez les privilèges d'administrateur
      </Typography>

      <Stack sx={{ padding: '0 1rem' }}>
        <TextField
          data-testid="admin-search-input"
          placeholder="Rechercher par tag ou email..."
          fullWidth
          value={debouncedSearch}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              height: '2.75rem',
              paddingRight: '0.375rem',
              borderRadius: '1.125rem',
            },
            '& .MuiInputBase-input': {
              padding: '0 0.5rem 0 1rem',
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <AdminFilterMenu
                  data-testid="admin-filter-button"
                  filters={filters}
                  setFilters={setFilters}
                  getFilterOptions={getFilterOptions}
                  handleFilterSelect={handleFilterSelect}
                  getMemberStatusLabel={getMemberStatusLabel}
                />
              ),
            },
          }}
        />
      </Stack>

      <Stack
        sx={ModalScrollSx}
        data-scrolltop={canScrollTop}
        data-scrollbottom={canScrollBottom}
      >
        <DialogContent
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            maxHeight: '22rem',
            height: contentHeight,
            overflowY: 'auto',
            padding: 0,
            transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Stack
            ref={contentRef}
            className={
              isGettingUsers && users.length > 0 ? 'opacity-pulse' : ''
            }
            sx={{
              padding: '1rem',
              transform:
                isGettingUsers && users.length > 0 ? 'scale(0.98)' : 'none',
              transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            {isGettingUsers && users.length === 0 ? (
              <List disablePadding sx={{ height: '100%' }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <UserItem
                    key={index}
                    user={null}
                    handleToggleAdmin={() => {}}
                    authenticatedUser={null}
                    isPending={false}
                    handleBan={handleBan}
                  />
                ))}
              </List>
            ) : (
              <List disablePadding sx={{ height: '100%' }}>
                {users.map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    handleToggleAdmin={handleToggleAdmin}
                    authenticatedUser={authenticatedUser ?? null}
                    isPending={pendingIds.includes(user.id)}
                    handleBan={handleBan}
                  />
                ))}
                {!isGettingUsers && users.length === 0 && (
                  <Stack
                    padding="2rem 1.5rem"
                    spacing="0.25rem"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <Typography variant="h5" textAlign="center">
                      Aucun membre correspondant
                    </Typography>
                    <Typography
                      variant="body2"
                      textAlign="center"
                      width="14rem"
                      color="text.secondary"
                    >
                      Essayez de modifier votre recherche
                    </Typography>
                  </Stack>
                )}
              </List>
            )}
          </Stack>
        </DialogContent>
      </Stack>
    </Dialog>
  );
};
