import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export interface ViewNewFiltersProps {
  handleFilter: (filterValue: FilterOption | null) => void;
  filterOption: FilterOption | null;
  showFilterSaveForm: boolean;
  handleFilterSaveForm: (value: boolean) => void;
}
