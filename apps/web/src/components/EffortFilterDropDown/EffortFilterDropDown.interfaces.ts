import type { FilterOption } from '@/app/interfaces/Filter.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface EffortFilterDropDownProps {
  showEffortFilterDropDown: boolean;
  setShowEffortFilterDropDown: Dispatch<SetStateAction<boolean>>;
  handleFilter: (filterOption: FilterOption) => void;
}
