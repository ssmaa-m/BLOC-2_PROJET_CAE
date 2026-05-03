import { useScrollIndicator } from '../../../../../hooks/useScrollIndicator';
import { useAdminAction } from './useAdminAction';
import { useFilters } from './useFilters';

export const useAdminManagementModal = ({ open }: { open: boolean }) => {
  const {
    getAll,
    handleBan,
    isGettingUsers,
    handleToggleAdmin,
    pendingIds,
    users,
  } = useAdminAction();
  const {
    scrollRef,
    canScrollTop,
    canScrollBottom,
    handleScroll,
    contentRef,
    contentHeight,
  } = useScrollIndicator({ isGettingUsers, open });
  const {
    filters,
    setFilters,
    debouncedSearch,
    setDebouncedSearch,
    getFilterOptions,
    handleFilterSelect,
    getMemberStatusLabel,
  } = useFilters({ open, handleScroll, getAll });

  return {
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
  };
};
