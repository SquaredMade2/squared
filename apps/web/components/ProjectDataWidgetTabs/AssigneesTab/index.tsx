import { useState } from 'react';
import { ClickAwayListener } from '@mui/base';
import type { SetFilter } from '@/app/interfaces/ProjectDataWidget.interfaces';
import { useAppDispatch, useAppSelector } from '@/hooks/typeScriptReduxHooks';
import { AddIcon, UnassignedSVGInDropdown } from '../../Svg';
import ProfileImage from '../../ProfileImage';
import { setCurrentFilter } from '@/store/filterPage/actions';
import WidgetAssigneeDropdown from '../../WidgetAssigneeDropdown';
import type { AssigneesTabProps } from './AssigneesTab.interfaces';

export const AssigneesTab = ({ assigneesData }: AssigneesTabProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const lightSettings = useAppSelector((state) => state.userSettings).theme;
  const currentAssigneeFilters = useAppSelector(
    (state) => state.filterPage.currentFilters,
  ).assignee;

  const [toggleDropdown, setToggleDropdown] = useState(true);

  const styles = {
    tabContainer: 'flex flex-col items-center mt-10 m-5 w-full max-h-80',
    tabLabel: `mr-auto mr-2 my-2 font-light text-lg ${
      lightSettings === 'dark' ? 'text-muted-foreground' : ''
    } h-8`,
    dropdownButton: `flex flex-row items-center w-full h-12 border border-border bg-textField px-4 rounded-xl border outline-none ${
      lightSettings === 'dark'
        ? `${toggleDropdown === true ? 'border-slate-100' : 'border-slate-600'}`
        : ''
    } cursor-pointer`,
    buttonWrapper: 'flex flex-row w-full items-center justify-end overflow-x-scroll',
    addIconWrapper: 'absolute m-5',
    assigneesWrapper: `absolute bg-card z-30 mt-24 flex flex-col ${
      toggleDropdown === true ? '' : 'hidden'
    } border border-slate-600 w-5/6 h-auto max-h-60 rounded-lg p-3 overflow-y-auto`,
    currentFilters: 'flex flex-row w-60 overflow-scroll',
    eachFilter: 'flex h-1/2 flex-row justify-center items-center text-nowrap mx-1',
  };

  const assigneesDataArray = Object.entries(assigneesData);

  const setFilter: SetFilter = (filterAssignee) => {
    if (filterAssignee) {
      const filterReq = {
        id: 1,
        name: filterAssignee,
        border: false,
        svg: <ProfileImage profileName={filterAssignee} location={'assigneeDropdown'} />,
        group: 'assignee',
      };
      dispatch(setCurrentFilter(filterReq));
    } else {
      const filterReq = {
        id: 0,
        name: 'none',
        border: false,
        svg: UnassignedSVGInDropdown(),
        group: 'assignee',
      };
      dispatch(setCurrentFilter(filterReq));
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setToggleDropdown(false)}>
      <div className={styles.tabContainer}>
        <label className={styles.tabLabel}> Assignees </label>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.dropdownButton}
            onClick={() => setToggleDropdown(!toggleDropdown)}
            type="button"
          >
            <ul className={styles.currentFilters}>
              {currentAssigneeFilters?.map((assignee) => {
                return (
                  <li className={styles.eachFilter} key={assignee}>
                    {assignee === null ? (
                      <UnassignedSVGInDropdown />
                    ) : (
                      <ProfileImage profileName={assignee} location={'assigneeDropdown'} />
                    )}
                  </li>
                );
              })}
            </ul>
          </button>
          <div className={styles.addIconWrapper}>{AddIcon()}</div>
        </div>
        <div className={styles.assigneesWrapper}>
          {assigneesDataArray.map((assignee) => {
            return (
              <div key={assignee[0]}>
                <WidgetAssigneeDropdown assignee={assignee} setFilter={setFilter} />
              </div>
            );
          })}
        </div>
      </div>
    </ClickAwayListener>
  );
};
