import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/typeScriptReduxHooks';
import { deleteAllCurrentFilters } from '@/store/filterPage/actions';
import { saveFilterIcon, lock } from '@/components/Svg';
import SelectedFilter from '@/components/SelectedFilter';
import type { FilterSaveFormProps } from './FilterSaveForm.interfaces';
import type { RootState } from '@/store';
import type { CurrentFilters } from '@/store/filterPage';

const styles = {
  main: 'grid grid-rows-3 h-[20vh] w-full bg-card border border-border',
  topDiv: 'flex items-center bg-card',
  icon: 'border border-border rounded ml-2 p-0.5',
  lockIcon: 'ml-0.5',
  titleInputDiv: 'ml-2 w-9/12 h-5/6 bg-card',
  titleInput: 'w-full h-full bg-card caret-slate-400 text-foreground focus-visible:outline-none',
  visibilityDiv: 'flex items-center ml-20 text-foreground',
  visibilityText: 'text-sm',
  visibilityButton:
    'flex cursor-pointer items-center ml-1 p-0.5 text-foreground text-xs border border-border rounded',
  visibilityButtonText: 'text-foreground ml-1 mr-0.5',
  descriptionDiv: 'flex items-center',
  descriptionInput:
    'w-11/12 text-foreground h-4/6 ml-11 bg-card caret-slate-400 focus-visible:outline-none placeholder:text-xs',
  statusButtons: 'grid items-center grid-cols-2 border-t border-border',
  createCancelDiv: 'flex justify-end',
  cancelButton: 'rounded bg-card p-0.5 mr-2 cursor-pointer',
  cancelText: 'text-foreground',
  createButton: 'rounded border border-secondary bg-background p-0.5 mr-6 cursor-pointer',
  leftSide: 'flex items-center text-foreground ml-2',
  firstButton: 'flex items-center p-1 border rounded-l border-border bg-background',
  secondButton: 'flex items-center p-1 border border-border bg-background',
  thirdButton: 'flex items-center p-1 border border-border bg-background',
  fourthButton: 'flex items-center p-1 border rounded-r border-border bg-background',
  filterStatusButtons: 'flex',
};

const FilterSaveForm = ({
  handleFilter,
  handleFilterSaveForm,
  setShowFilterSaveForm,
  redirectToViewsOnCreate = false,
}: FilterSaveFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterDescription, setFilterDescription] = useState<string>('');
  const [filterSelected, setFilterSelected] = useState(false);
  const [taskAttributeTitles, setTaskAttributeTitles] = useState<string[]>([]);

  const teamId = useSelector((state: RootState) => state.taskData.currentTeam._id);
  const currentFilters = useSelector((state: RootState) => state.filterPage.currentFilters);
  const workspace = useSelector((state: RootState) => state.taskData.currentWorkspace);
  const team = useSelector((state: RootState) => state.taskData.currentTeam);

  const handleSaveFilter = async () => {
    try {
      await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER}/filter/create`,
        method: 'POST',
        data: {
          filterTitle,
          filterOption: currentFilters,
          filterDescription,
          teamId,
        },
      });
      setShowFilterSaveForm(false);
      if (redirectToViewsOnCreate) {
        dispatch(deleteAllCurrentFilters());
        router.push(`/workspace/${workspace.url}/team/${team.identifier}/views`);
      }
    } catch (err) {}
  };

  useEffect(() => {
    setTaskAttributeTitles(Object.keys(currentFilters));
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
    <div className={styles.main}>
      <div className={styles.topDiv}>
        <div id="icon" className={styles.icon}>
          {saveFilterIcon()}
        </div>
        {/* future update: make icon dropdown menu */}
        <div className={styles.titleInputDiv}>
          <input
            type="text"
            placeholder="Untitled Issue Title"
            className={styles.titleInput}
            onChange={(e) => {
              setFilterTitle(e.target.value);
            }}
          />
        </div>
        <div className={styles.visibilityDiv}>
          <p className={styles.visibilityText}>Visibility</p>
          <button type="button" className={styles.visibilityButton}>
            <div className={styles.lockIcon}>{lock()}</div>
            <p className={styles.visibilityButtonText}>Private</p>
          </button>
          {/* future update: make privacy dropdown functional */}
        </div>
      </div>
      <div
        className={styles.descriptionDiv}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setFilterDescription(target.value);
        }}
      >
        <input
          type="text"
          placeholder="Description (optional)"
          className={styles.descriptionInput}
        />
      </div>
      <div className={styles.statusButtons}>
        <div className={styles.filterStatusButtons}>
          {filterSelected &&
            taskAttributeTitles.map((taskAttributeTitle) => {
              return (currentFilters[taskAttributeTitle as keyof CurrentFilters] as string[]).map(
                (taskAttribute) => {
                  return (
                    <SelectedFilter
                      key={taskAttribute}
                      taskAttribute={taskAttribute}
                      taskAttributeTitle={taskAttributeTitle}
                      handleFilter={handleFilter}
                    />
                  );
                },
              );
            })}
        </div>
        <div className={styles.createCancelDiv}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              handleFilterSaveForm(false);
              handleFilter(null);
            }}
          >
            <p className={styles.cancelText}>Cancel</p>
          </button>
          <button type="button" onClick={handleSaveFilter} className={styles.createButton}>
            <p className={styles.cancelText}>Create</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSaveForm;
