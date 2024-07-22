import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export interface SelectedFilterProps {
  handleFilter: (filterValue: FilterOption | null) => void;
  taskAttribute: string;
  taskAttributeTitle: string;
}
