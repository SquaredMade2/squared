import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export interface TopNavBarProps {
  filterOption: FilterOption | null;
  showFilterSaveForm: boolean;
  showNavBar: boolean;
  handleFilterSaveForm: (value: boolean) => void;
  handleFilter: (filterValue: FilterOption | null) => void;
}
