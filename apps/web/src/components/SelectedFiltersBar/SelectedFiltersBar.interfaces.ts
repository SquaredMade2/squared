import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export type SelectedFiltersBarProps = {
  filterOption: object | null;
  showFilterSaveForm: boolean;
  handleFilter(filterValue: FilterOption | null): void;
  handleFilterSaveForm(value: boolean): void;
};
