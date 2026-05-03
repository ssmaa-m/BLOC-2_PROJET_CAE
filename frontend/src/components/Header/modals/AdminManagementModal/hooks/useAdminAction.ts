import { useState } from 'react';
import { useModal } from '../../../../../hooks/useModal';
import { useModalController } from '../../../../../hooks/useModalController';
import { useSnackbar } from '../../../../../hooks/useSnackbar';
import { useUser } from '../../../../../hooks/useUser';
import { Member } from '../../../../../types';
import { useMembers } from '../../../../../hooks/useMembers';
import { banModal } from '../../banModal';

export const useAdminAction = () => {
  const { authenticatedUser } = useUser();
  const { showSnackbar } = useSnackbar();
  const { openModal } = useModal();
  const { setLoading } = useModalController();

  const [users, setUsers] = useState<Member[]>([]);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const { getAll, toggleAdmin, isGettingUsers, banMember, checkIsLastMember } =
    useMembers({
      setUsers,
      setPendingIds,
    });

  const handleToggleAdmin = async (user: Member) => {
    if (user.id === authenticatedUser?.id) {
      showSnackbar({
        message: "Vous ne pouvez pas changer votre propre statut d'admin.",
        severity: 'error',
      });
      return;
    }

    if (pendingIds.includes(user.id)) return;

    toggleAdmin(user.id, user.admin);
  };

  const handleBan = async (id: number, tag: string) => {
    const isLast = await checkIsLastMember(id);

    console.log('isLastMember =', isLast);
    openModal(
      banModal({
        tag,
        isLastMember: isLast,
        onConfirm: async (close) => {
          setLoading(true);
          await banMember(id);
          close();
        },
      }),
    );
  };

  return {
    getAll,
    handleBan,
    isGettingUsers,
    handleToggleAdmin,
    pendingIds,
    users,
  };
};
