import type { FilterOption } from '@/app/interfaces/Filter.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface PriorityFilterDropDownProps {
  showPriorityFilterDropDown: boolean;
  setShowPriorityFilterDropDown: Dispatch<SetStateAction<boolean>>;
  handleFilter: (filterOption: FilterOption) => void;
}
