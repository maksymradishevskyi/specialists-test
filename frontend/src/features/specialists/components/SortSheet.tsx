import { IonActionSheet } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import type { SortOption } from '../types';

type SortSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
  selected: SortOption;
};

const sortButtons: Array<{ text: string; option: SortOption }> = [
  { text: 'Rating (high to low)', option: { sortBy: 'rating', sortDirection: 'desc' } },
  { text: 'Rating (low to high)', option: { sortBy: 'rating', sortDirection: 'asc' } },
  { text: 'Price (low to high)', option: { sortBy: 'price', sortDirection: 'asc' } },
  { text: 'Price (high to low)', option: { sortBy: 'price', sortDirection: 'desc' } },
  { text: 'Age (low to high)', option: { sortBy: 'age', sortDirection: 'asc' } },
  { text: 'Age (high to low)', option: { sortBy: 'age', sortDirection: 'desc' } },
  { text: 'Name (A-Z)', option: { sortBy: 'name', sortDirection: 'asc' } },
  { text: 'Name (Z-A)', option: { sortBy: 'name', sortDirection: 'desc' } }
];

const SortSheet = ({ isOpen, onClose, onSelect, selected }: SortSheetProps) => (
  <IonActionSheet
    isOpen={isOpen}
    onDidDismiss={onClose}
    buttons={sortButtons.map(({ text, option }) => ({
      text,
      icon:
        option.sortBy === selected.sortBy && option.sortDirection === selected.sortDirection
          ? checkmark
          : undefined,
      handler: () => onSelect(option)
    }))}
    header="Sort specialists"
  />
);

export default SortSheet;

