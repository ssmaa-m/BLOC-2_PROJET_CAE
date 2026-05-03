import { ModalConfig } from '../../../types';
import { UnavailabilitiesModalContent } from './UnavailabilitiesModalContent';

interface UnavailabilitiesData {
  id: number;
  startDate: string;
  endDate: string;
}

export const unavailabilitiesModal = ({
  unavailabilities,
  onSelect,
  onConfirm,
}: {
  unavailabilities: UnavailabilitiesData[] | null;
  onSelect: (
    dates: {
      tempId: number;
      startDate: string;
      endDate: string;
    } | null,
  ) => void;
  onConfirm: (close: () => void) => void;
}): ModalConfig => ({
  title: 'Ajouter une indisponibilité',
  subtitle: 'Ajoutez une indisponibilité en complétant les champs ci-dessous',
  confirmLabel: 'Confirmer',
  cancelLabel: 'Annuler',
  children: (
    <UnavailabilitiesModalContent
      unavailabilities={unavailabilities}
      onSelect={onSelect}
    />
  ),
  onConfirm: (close) => onConfirm(close),
  onCancel: (close) => close(),
});
