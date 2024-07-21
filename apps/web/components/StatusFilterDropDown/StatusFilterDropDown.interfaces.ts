import type { FilterOption } from '@/app/interfaces/Filter.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface StatusFilterDropDownProps {
  showStatusFilterDropDown: boolean;
  setShowStatusFilterDropDown: Dispatch<SetStateAction<boolean>>;
  handleFilter: (filterOption: FilterOption) => void;
}
