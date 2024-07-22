import type { FilterOption } from '@/app/interfaces/Filter.interfaces';
import type { Dispatch, SetStateAction } from 'react';

export interface LabelFilterDropDownProps {
  showLabelFilterDropDown: boolean;
  setShowLabelFilterDropDown: Dispatch<SetStateAction<boolean>>;
  handleFilter: (filterOption: FilterOption) => void;
}
