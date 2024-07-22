import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export interface Props {
  showFilterDropDown: boolean;
  setShowFilterDropDown: (value: boolean) => void;
  handleFilter: (filterOption: FilterOption | null) => void;
}
