import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks/typeScriptReduxHooks';
import type { FilterType } from '@/store/filterPage/types';
import { setFilterType } from '@/store/filterPage/actions';
import { saveView, plusIcon } from '@/components/Svg';
import SelectedFilter from '@/components/SelectedFilter';
import FilterDropDown from '@/components/FilterDropdown';
import type { SelectedFiltersBarProps } from './SelectedFiltersBar.interfaces';
import type { DateFilter } from '@/store/filterPage';

const styles = {
  main: 'grid grid-cols-6 h-full text-foreground border-border bg-card border-t',
  leftSide: 'flex items-center ml-5 col-span-4 flex-wrap mb-1',
  rightSide: 'flex justify-end pr-5 text-foreground bg-card col-span-2',
  saveButton:
    'flex mt-[7px] h-5 items-center ml-1.5 cursor-pointer border p-3 rounded border-border bg-background hover:bg-accent',
  issueCount: 'mt-[7px] text-muted-foreground',
  savePadding: 'pl-1',
  filterType:
    'mx-2 px-1 bg-card border border-border rounded-md text-muted-foreground cursor-pointer select-no-arrow',
};

const SelectedFiltersBar = ({
  showFilterSaveForm,
  handleFilter,
  handleFilterSaveForm,
}: SelectedFiltersBarProps) => {
  const dispatch = useDispatch();
  const [showFilterDropDown, setShowFilterDropDown] = useState<boolean>(false);
  const [taskAttributeTitles] = useState<
    Array<'status' | 'priority' | 'labels' | 'dueDate' | 'effortEstimate'>
  >(['status', 'priority', 'labels', 'dueDate', 'effortEstimate']);
  const [filterSelected, setFilterSelected] = useState<boolean>(false);
  const currentFilters = useAppSelector((state) => state.filterPage.currentFilters);
  const filteredTaskList = useAppSelector((state) => state.filterPage.filteredTaskList);
  const filterType = useAppSelector((state) => state.filterPage.filterType);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterType = e.target.value as FilterType;
    dispatch(setFilterType(newFilterType));
  };

  const handleFilterSave = (): void => {
    if (!showFilterSaveForm) {
      handleFilterSaveForm(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      const clickOutsideDropdown = !dropdownRef.current?.contains(e.target as HTMLElement);
      if (clickOutsideDropdown) {
        setShowFilterDropDown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  useEffect(() => {
    const noFilterSelected =
      currentFilters.status.length === 0 &&
      currentFilters.priority.length === 0 &&
      currentFilters.labels.length === 0 &&
      currentFilters.dueDate.length === 0 &&
      currentFilters.effortEstimate.length === 0;

    if (noFilterSelected) {
      setFilterSelected(false);
    } else {
      setFilterSelected(true);
    }
  }, [currentFilters]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.leftSide}>
          {filterSelected &&
            taskAttributeTitles.map((taskAttributeTitle) => {
              return currentFilters[taskAttributeTitle].map(
                (taskAttribute: string | number | DateFilter) => {
                  return (
                    <SelectedFilter
                      key={taskAttributeTitle}
                      taskAttribute={taskAttribute as string}
                      taskAttributeTitle={taskAttributeTitle}
                      handleFilter={handleFilter}
                    />
                  );
                },
              );
            })}
          <div>
            <button
              type="button"
              onClick={() => {
                setShowFilterDropDown(true);
              }}
              className="ml-3 p-0.5 w-5 h-5 flex items-center cursor-pointer justify-center hover:bg-background "
            >
              <p>{plusIcon()}</p>
            </button>
            <div ref={dropdownRef} className="relative left-3">
              <FilterDropDown
                showFilterDropDown={showFilterDropDown}
                setShowFilterDropDown={setShowFilterDropDown}
                handleFilter={handleFilter}
              />
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <p className={styles.issueCount}>
            Showing issues that match
            <select
              className={styles.filterType}
              onChange={handleFilterTypeChange}
              value={filterType}
            >
              <option value="all">ALL</option>
              <option value="any">ANY</option>
            </select>
            filters | {filteredTaskList.length} |
          </p>
          <button type="button" className={styles.saveButton} onClick={handleFilterSave}>
            {saveView()}
            <p className={styles.savePadding}>Save</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectedFiltersBar;
