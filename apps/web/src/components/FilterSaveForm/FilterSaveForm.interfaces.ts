import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export interface FilterSaveFormProps {
  filterOption: FilterOption | null;
  handleFilter: (filterValue: FilterOption | null) => void;
  handleFilterSaveForm: (value: boolean) => void;
  setShowFilterSaveForm: (value: boolean) => void;
  redirectToViewsOnCreate?: boolean;
}
