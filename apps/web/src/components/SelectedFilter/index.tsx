import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { deleteSelectedFilter } from '@/store/filterPage/actions';
import FilterSelectIsOrIsNot from '@/components/FilterSelectIsOrIsNot';
import StatusFilterDropDown from '@/components/StatusFilterDropDown';
import PriorityFilterDropDown from '@/components/PriorityFilterDropDown';
import LabelFilterDropDown from '@/components/LabelFilterDropDown';
import DueDateFilterDropDown from '@/components/DueDateFilterDropDown';
import EffortFilterDropDown from '@/components/EffortFilterDropDown';
import type { RootState } from '@/store';
import type { CurrentFilters } from '@/store/filterPage';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import type { SelectedFilterProps } from './SelectedFilter.interfaces';

const styles = {
  main: 'flex items-center ml-3 text-foreground mt-1',
  filterFor: 'text-sm text-foreground font-semibold mr-2',
  titleStatus:
    'py-1 px-2 text-sm text-foreground bg-card rounded-l-md border-t border-b border-l border-border',
  selectIsOrIsNotButton:
    'py-1 px-2 text-sm text-foreground bg-card border-t border-b border-border hover:bg-accent hover:text-foreground cursor-pointer',
  statusSelectButton:
    'py-1 px-2 text-sm text-foreground font-semibold bg-card border-t border-b border-border hover:bg-accent cursor-pointer',
  clearButton:
    'py-1 px-2 mr-4 text-sm text-foreground bg-card rounded-r-md border hover:bg-accent hover:text-red-500 cursor-pointer',
  filterDropdown: 'absolute w-72 top-full left-0',
};

export default function SelectedFilter({
  handleFilter,
  taskAttribute,
  taskAttributeTitle,
}: SelectedFilterProps) {
  const [toggleSelectIsOrIsNot, setToggleSelectIsOrIsNot] = useState(true);
  const [showSelectIsOrIsNot, setShowSelectIsOrIsNot] = useState(false);
  const [showChangeOptionDropDown, setShowChangeOptionDropDown] = useState(false);
  const [showStatusFilterDropDown, setShowStatusFilterDropDown] = useState(false);
  const [showPriorityFilterDropDown, setShowPriorityFilterDropDown] = useState(false);
  const [showLabelFilterDropDown, setShowLabelFilterDropDown] = useState(false);
  const [showDueDateFilterDropDown, setShowDueDateFilterDropDown] = useState(false);
  const [showEffortFilterDropDown, setShowEffortFilterDropDown] = useState(false);
  const selectIsOrIsNotRef = useRef<HTMLParagraphElement | null>(null);
  const currentFilters = useSelector((state: RootState) => state.filterPage.currentFilters);
  const dispatch = useAppDispatch();

  const deleteFilter = (taskAttributeTitle: keyof CurrentFilters, taskAttributeDeleted: string) => {
    let updatedAttributes: (string | number | null)[] = [];

    if (taskAttributeTitle === 'effortEstimate') {
      updatedAttributes = (currentFilters[taskAttributeTitle] as number[]).filter(
        (taskAttribute) => taskAttribute !== Number.parseFloat(taskAttributeDeleted),
      );
    } else {
      updatedAttributes = (currentFilters[taskAttributeTitle] as (string | null)[]).filter(
        (taskAttribute) => taskAttribute !== taskAttributeDeleted,
      );
    }

    const updatedFilters = {
      ...currentFilters,
      [taskAttributeTitle]: updatedAttributes,
    };
    dispatch(deleteSelectedFilter(updatedFilters));
  };

  useEffect(() => {
    const closeStatusMenu = (e: MouseEvent) => {
      if ((e.composedPath()[0] as HTMLElement).id !== 'statusMenu') {
        setShowChangeOptionDropDown(false);
        setShowStatusFilterDropDown(false);
      }
    };

    return () => {
      document.body.removeEventListener('click', closeStatusMenu);
    };
  });

  useEffect(() => {
    if (showChangeOptionDropDown) {
      switch (taskAttributeTitle) {
        case 'status':
          setShowStatusFilterDropDown(true);
          break;
        case 'priority':
          setShowPriorityFilterDropDown(true);
          break;
        case 'labels':
          setShowLabelFilterDropDown(true);
          break;
        case 'dueDate':
          setShowDueDateFilterDropDown(true);
          break;
        case 'effortEstimate':
          setShowEffortFilterDropDown(true);
          break;
      }
    } else {
      setShowStatusFilterDropDown(false);
      setShowPriorityFilterDropDown(false);
      setShowLabelFilterDropDown(false);
      setShowDueDateFilterDropDown(false);
      setShowEffortFilterDropDown(false);
    }
  }, [showChangeOptionDropDown]);

  return (
    <>
      <div className={styles.main}>
        <p className={styles.filterFor}>Filter for</p>
        <div className={styles.titleStatus}>
          <div>{taskAttributeTitle}</div>
        </div>
        <div className="relative">
          <button
            type="button"
            className={styles.selectIsOrIsNotButton}
            onMouseEnter={() => setShowSelectIsOrIsNot(true)}
          >
            <p ref={selectIsOrIsNotRef} id="isLabel">
              {toggleSelectIsOrIsNot === true ? 'is' : 'is not'}
            </p>
          </button>
          <FilterSelectIsOrIsNot
            toggleSelectIsOrIsNot={toggleSelectIsOrIsNot}
            setShowSelectIsOrIsNot={setShowSelectIsOrIsNot}
            setToggleSelectIsOrIsNot={setToggleSelectIsOrIsNot}
            showSelectIsOrIsNot={showSelectIsOrIsNot}
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowChangeOptionDropDown(!showChangeOptionDropDown);
            }}
            className={styles.statusSelectButton}
          >
            <div>
              {/* {taskAttribute.date ? (
								<p id="statusMenu">
									{taskAttribute.comparison} {taskAttribute.date.split('T')[0]}
								</p>
							) : ( */}
              <p id="statusMenu">{taskAttribute}</p>
              {/* )} */}
            </div>
          </button>
          <div id="StatusFilterDropDown" className={styles.filterDropdown}>
            <StatusFilterDropDown
              showStatusFilterDropDown={showStatusFilterDropDown}
              setShowStatusFilterDropDown={setShowStatusFilterDropDown}
              handleFilter={handleFilter}
            />
          </div>
          <div id="PriorityFilterDropDown" className={styles.filterDropdown}>
            <PriorityFilterDropDown
              handleFilter={handleFilter}
              setShowPriorityFilterDropDown={setShowPriorityFilterDropDown}
              showPriorityFilterDropDown={showPriorityFilterDropDown}
            />
          </div>
          <div id="LabelFilterDropDown" className={styles.filterDropdown}>
            <LabelFilterDropDown
              handleFilter={handleFilter}
              setShowLabelFilterDropDown={setShowLabelFilterDropDown}
              showLabelFilterDropDown={showLabelFilterDropDown}
            />
          </div>
          <div id="DueDateFilterDropDown" className={`${styles.filterDropdown} -mt-20`}>
            <DueDateFilterDropDown
              handleFilter={handleFilter}
              setShowDueDateFilterDropDown={setShowDueDateFilterDropDown}
              showDueDateFilterDropDown={showDueDateFilterDropDown}
            />
          </div>
          <div id="EffortFilterDropDown" className={styles.filterDropdown}>
            <EffortFilterDropDown
              handleFilter={handleFilter}
              setShowEffortFilterDropDown={setShowEffortFilterDropDown}
              showEffortFilterDropDown={showEffortFilterDropDown}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const taskAttributeDeleted = taskAttribute;
            deleteFilter(taskAttributeTitle as keyof CurrentFilters, taskAttributeDeleted);
          }}
          className={styles.clearButton}
        >
          clear
        </button>
      </div>
    </>
  );
}
