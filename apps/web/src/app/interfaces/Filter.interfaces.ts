import type { Dispatch, SetStateAction } from 'react';

export interface FilterOption {
  id: number;
  name: string;
  border: boolean;
  svg: object;
  group: string;
  comparison?: string | null;
}

export interface NavbarVisibitliyProps {
  showNavBar: boolean;
}

export interface DueDateFilterDropDownProps {
  showDueDateFilterDropDown: boolean;
  setShowDueDateFilterDropDown: Dispatch<SetStateAction<boolean>>;
  handleFilter: (filterOption: FilterOption) => void;
}

export type clearFilterType = () => void;
